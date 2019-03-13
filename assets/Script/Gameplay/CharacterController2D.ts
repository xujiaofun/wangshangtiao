const {ccclass, property} = cc._decorator;

class CharacterRaycastOrigins {
    topLeft:cc.Vec2
    bottomRight:cc.Vec2
    bottomLeft:cc.Vec2
}

class CharacterCollisionState2D {
    right:boolean = false
    left:boolean = false
    above:boolean = false
    below:boolean = false
    becameGroundedThisFrame:boolean = false
    wasGroundedLastFrame:boolean = false
    movingDownSlope:boolean = false
    slopeAngle:number = 0

    hasCollision() {
        return this.below || this.right || this.left || this.above
    }

    reset() {
        this.right = this.left = this.above = this.below = this.becameGroundedThisFrame = this.movingDownSlope = false
		this.slopeAngle = 0
    }
}

@ccclass
export default class CharacterController2D extends cc.Component {

    // when true, one way platforms will be ignored when moving vertically for a single frame
    ignoreOneWayPlatformsThisFrame:boolean = false

    _skinWidth:number = 0.02
    @property()
    get skinWidth() {
        return this._skinWidth
    }
    set skinWidth(value) {
        this._skinWidth = value
    }

    @property()
    totalHorizontalRays:number = 8
    @property()
    totalVerticalRays:number = 4

    slopeLimit:number = 30
    jumpingThreshold:number = 0.07

    velocity:cc.Vec2 = cc.v2()
    kSkinWidthFloatFudgeFactor:number = 0.001
    _slopeLimitTangent = Math.tan(75 * 180 / Math.PI)

    _raycastOrigins:CharacterRaycastOrigins = new CharacterRaycastOrigins()
    collisionState:CharacterCollisionState2D = new CharacterCollisionState2D()
    _verticalDistanceBetweenRays:number = 0
    _horizontalDistanceBetweenRays:number = 0
    _isGoingUpSlope = false
    _raycastHit:cc.PhysicsRayCastResult
    _raycastHitsThisFrame:cc.PhysicsRayCastResult[] = []

    get isGrounded() {
        return this.collisionState.below
    }

    boxCollider:cc.BoxCollider
    phyManager:cc.PhysicsManager

    start () {
        this.phyManager = cc.director.getPhysicsManager()
        this.phyManager.enabled = true
        this.boxCollider = this.node.getComponent(cc.BoxCollider)
        this.skinWidth = this._skinWidth
    }

    move(deltaMovement:cc.Vec2, dt) {
        this.collisionState.wasGroundedLastFrame = this.collisionState.below
        
        this.collisionState.reset()
        this._isGoingUpSlope = false

        this.primeRaycastOrigins()

        if( deltaMovement.y < 0 && this.collisionState.wasGroundedLastFrame )
            this.handleVerticalSlope( deltaMovement )
            
        if( deltaMovement.x != 0 )
            this.moveHorizontally( deltaMovement )
            
        if( deltaMovement.y != 0 )
            this.moveVertically( deltaMovement )
            
        let worldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO)
        let lastPos = worldPos.add(deltaMovement)
        let localPos = this.node.parent.convertToNodeSpaceAR(lastPos)
        this.node.setPosition(localPos)

        if (dt > 0) {
            this.velocity = deltaMovement.div(dt)
        }

        if( !this.collisionState.wasGroundedLastFrame && this.collisionState.below )
        this.collisionState.becameGroundedThisFrame = true;

		// if we are going up a slope we artificially set a y velocity so we need to zero it out here
		if( this._isGoingUpSlope )
        this.velocity.y = 0;

		// send off the collision events if we have a listener
		// if( this.onControllerCollidedEvent != null )
		// {
		// 	for( var i = 0; i < this._raycastHitsThisFrame.length; i++ )
        //         this.onControllerCollidedEvent( this._raycastHitsThisFrame[i] );
		// }

		this.ignoreOneWayPlatformsThisFrame = false;
    }

    primeRaycastOrigins() {
        let modifiedSize = this.boxCollider.size.clone()
        modifiedSize.width = modifiedSize.width - 2 * this.skinWidth
        modifiedSize.height = modifiedSize.height - 2 * this.skinWidth

        let pos = this.node.getPosition()
        let offset = this.boxCollider.offset
        this._raycastOrigins.topLeft = this.node.convertToWorldSpaceAR(cc.v2(offset.x - modifiedSize.width * 0.5, offset.y + modifiedSize.height * 0.5))
        this._raycastOrigins.bottomRight = this.node.convertToWorldSpaceAR(cc.v2(offset.x + modifiedSize.width * 0.5, offset.y - modifiedSize.height * 0.5))
        this._raycastOrigins.bottomLeft = this.node.convertToWorldSpaceAR(cc.v2(offset.x - modifiedSize.width * 0.5, offset.y - modifiedSize.height * 0.5))
    }

    handleVerticalSlope(deltaMovement:cc.Vec2) {
        // slope check from the center of our collider
		let centerOfCollider = ( this._raycastOrigins.bottomLeft.x + this._raycastOrigins.bottomRight.x ) * 0.5;
		let rayDirection = cc.Vec2.UP.mul(-1)

		// the ray distance is based on our slopeLimit
		let slopeCheckRayDistance = this._slopeLimitTangent * ( this._raycastOrigins.bottomRight.x - centerOfCollider );

        let slopeRay = cc.v2( centerOfCollider, this._raycastOrigins.bottomLeft.y );
        
        let result = this.rayCast(slopeRay, rayDirection, slopeCheckRayDistance)

		if( result && result.length > 0 )
		{
            this._raycastHit = result[0]
			// bail out if we have no slope
			let angle = this._raycastHit.normal.angle(cc.Vec2.UP)
			if( angle == 0 )
				return;
			// we are moving down the slope if our normal and movement direction are in the same x direction
			let isMovingDownSlope = Mathf.sign( this._raycastHit.normal.x ) == Mathf.sign( deltaMovement.x );
			if( isMovingDownSlope )
			{
				// going down we want to speed up in most cases so the slopeSpeedMultiplier curve should be > 1 for negative angles
				let slopeModifier = 1
				// we add the extra downward movement here to ensure we "stick" to the surface below
				deltaMovement.y += this._raycastHit.point.y - slopeRay.y - this.skinWidth;
				deltaMovement.x *= slopeModifier;
				this.collisionState.movingDownSlope = true;
				this.collisionState.slopeAngle = angle;
			}
		}
    }

    moveHorizontally(deltaMovement) {
        let isGoingRight = deltaMovement.x > 0
        let rayDistance = Math.abs(deltaMovement.x) + this.skinWidth
        let rayDirection = isGoingRight ? cc.Vec2.RIGHT : cc.Vec2.RIGHT.mul(-1)
        let initialRayOrigin = isGoingRight ? this._raycastOrigins.bottomRight : this._raycastOrigins.bottomLeft;

        for (let i = 0; i < this.totalHorizontalRays; i++) {
            let ray = cc.v2(initialRayOrigin.x, initialRayOrigin.y + i * this._verticalDistanceBetweenRays)

            let hits:cc.PhysicsRayCastResult[]
            if (i == 0 && this.collisionState.wasGroundedLastFrame) {
                // cc.Intersection.lineRect(this.boxCollider.)
                hits = this.rayCast(ray, rayDirection, rayDistance)
            } else {
                hits = this.rayCast(ray, rayDirection, rayDistance)
            }

            if (hits && hits.length > 0) {
                this._raycastHit = hits[0]
                if (i == 0 && this.handleHorizontalSlope(deltaMovement, this._raycastHit.normal.angle(cc.Vec2.UP))) {
                    this._raycastHitsThisFrame.push(this._raycastHit)
                    break
                }

                deltaMovement.x = this._raycastHit.point.x - ray.x
                rayDistance = Math.abs(deltaMovement.x)

                if (isGoingRight) {
                    deltaMovement.x -= this._skinWidth
                    this.collisionState.right = true
                } else {
                    deltaMovement.x += this._skinWidth
                    this.collisionState.left = true
                }

                this._raycastHitsThisFrame.push(this._raycastHit)

                if( rayDistance < this._skinWidth + this.kSkinWidthFloatFudgeFactor )
					break

            }
            
        }
    }

    handleHorizontalSlope(deltaMovement:cc.Vec2, angle) {
        if (Math.round(angle) == 90) {
            return false
        }

        const Deg2Rad = 180 / Math.PI
        if (angle < this.slopeLimit) {
            if( deltaMovement.y < this.jumpingThreshold ) {
                let slopeModifier = 1
                deltaMovement.x *= slopeModifier
                
                deltaMovement.y = Math.abs( Math.tan( angle * Deg2Rad ) * deltaMovement.x )
                let isGoingRight = deltaMovement.x > 0
                
                let ray = isGoingRight ? this._raycastOrigins.bottomRight : this._raycastOrigins.bottomLeft;
                let distance = deltaMovement.mag()
                let result = this.rayCast(ray, deltaMovement.normalize(), distance)
                if (result && result.length > 0) {
                    let raycastHit = result[0]
                    deltaMovement.set(raycastHit.point.sub(ray))
                    if (isGoingRight) {
                        deltaMovement.x -= this._skinWidth
                    } else {
                        deltaMovement.x += this._skinWidth
                    }
                }

                this._isGoingUpSlope = true
                this.collisionState.below = true
            }
        } else {
            deltaMovement.x = 0
        }
        return true
    }

    moveVertically(deltaMovement:cc.Vec2) {
        let isGoingUp = deltaMovement.y > 0;
		let rayDistance = Math.abs( deltaMovement.y ) + this._skinWidth  + 1000
		let rayDirection = isGoingUp ? cc.Vec2.UP : cc.Vec2.UP.mul(-1)
        let initialRayOrigin = isGoingUp ? this._raycastOrigins.topLeft : this._raycastOrigins.bottomLeft;
        
        initialRayOrigin.x += deltaMovement.x;
        for( let i = 0; i < this.totalVerticalRays; i++ )
		{
            let ray = cc.v2( initialRayOrigin.x + i * this._horizontalDistanceBetweenRays, initialRayOrigin.y );
            let result = this.rayCast(ray, rayDirection, rayDistance)
            if (result && result.length > 0) {
                this._raycastHit = result[0]
                // set our new deltaMovement and recalculate the rayDistance taking it into account
				deltaMovement.y = this._raycastHit.point.y - ray.y;
				rayDistance = Math.abs( deltaMovement.y );

				// remember to remove the skinWidth from our deltaMovement
				if( isGoingUp )
				{
					deltaMovement.y -= this._skinWidth;
					this.collisionState.above = true;
				}
				else
				{
					deltaMovement.y += this._skinWidth;
					this.collisionState.below = true;
				}

				this._raycastHitsThisFrame.push( this._raycastHit );

				// this is a hack to deal with the top of slopes. if we walk up a slope and reach the apex we can get in a situation
				// where our ray gets a hit that is less then skinWidth causing us to be ungrounded the next frame due to residual velocity.
				if( !isGoingUp && deltaMovement.y > 0.00001 )
                    this._isGoingUpSlope = true;

				// we add a small fudge factor for the float operations here. if our rayDistance is smaller
				// than the width + fudge bail out because we have a direct impact
				if( rayDistance < this._skinWidth + this.kSkinWidthFloatFudgeFactor )
					break;
            }
		}

    }

    rayCast(ray, direction, distance) {
        return this.phyManager.rayCast(ray, ray.add(direction.mul(distance)), cc.RayCastType.All)
    }

    

    
}