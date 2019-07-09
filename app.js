/// <reference path="./libs/babylon.d.ts" />

class Game {
    constructor() {
        // get canvas
        this.canvas = document.querySelector('#rendercanvas');

        // create BabylonJS engine object
        this.engine = new BABYLON.Engine(this.canvas, true);

        // create scene
        this.scene = new BABYLON.Scene(this.engine);

        // create camera
        this.camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 5, -10), this.scene);
        // set camera target to scene origin
        this.camera.setTarget(BABYLON.Vector3.Zero());
        // attach camera to canvas
        this.camera.attachControl(this.canvas, false);
        console.log(this.camera);

        // create a basic light, aiming 0, 1, 0 - meaning towards the sky
        this.light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), this.scene);

        // create a built-in "sphere" shape
        this.sphere = BABYLON.MeshBuilder.CreateSphere('sphere', {segments: 16, diameter: 2}, this.scene);
        // move sphere upwards 1/2 its height
        this.sphere.position.y = 1;

        // create a built-in "ground" shape
        this.ground = BABYLON.MeshBuilder.CreateGround('ground1', {height: 6, width: 6, subdivisions: 2}, this.scene);

        this.moveForward = false;
        this.moveBackward = false;
        this.moveRight = false;
        this.moveLeft = false;
        this.moveUp = false;
        this.moveDown = false;

        this.velocity = new BABYLON.Vector3();
        this.direction = new BABYLON.Vector3();
        this.prevTime = performance.now();

        BABYLON.SceneLoader.Append('./assets/', 'sambaDancing.gltf', this.scene, function(asset) {
            console.log('hi');
        });

        this.init();
    }

    init() {
        const game = this;

        window.addEventListener('resize', function() {
            game.engine.resize();
        });

        window.addEventListener('keydown', function(e) {
            switch ( e.keyCode ) {
                case 87: // w
                        game.moveForward = true;
                        console.log(game.moveForward);
                        break;
    
                case 65: // a
                        game.moveLeft = true;
                        break;
    
                case 83: // d
                        game.moveBackward = true;
                        break;
    
                case 68: // d
                        game.moveRight = true;
                        break;
    
                case 32: // up
                        game.moveUp = true;
                        break;
    
                case 16: // down
                        game.moveDown = true;
                        break;
            }
        });

        window.addEventListener('keyup', function(e) {
            switch ( e.keyCode ) {
    
                case 87: // w
                        game.moveForward = false;
                        break;
    
                case 65: // a
                        game.moveLeft = false;
                        break;
    
                case 83: // d
                        game.moveBackward = false;
                        break;
    
                case 68: // d
                        game.moveRight = false;
                        break;
    
                case 32: // up
                        game.moveUp = false;
                        break;
    
                case 16: // down
                        game.moveDown = false;
                        break;
                    }
        });

        console.log(this.camera);

        this.engine.runRenderLoop(function() {
            game.scene.render();
            game.animate();
        });
    }

    animate() {
        const game = this;

        var time = performance.now();
        var delta = ( time - game.prevTime ) / 1000;

        game.cameraMovement(delta);
    }

    cameraMovement(delta) {
        const game = this;

        game.velocity.x -= game.velocity.x * 7.5 * delta;
        game.velocity.z -= game.velocity.z * 7.5 * delta;
        game.velocity.y -= game.velocity.y * 7.5 * delta;

        game.direction.z = Number( game.moveForward ) - Number( game.moveBackward );
        game.direction.x = Number( game.moveLeft ) - Number( game.moveRight );
        game.direction.y = Number( game.moveUp ) - Number( game.moveDown );
        game.direction.normalize(); // this ensures consistent movements in all directions

        if ( game.moveForward || game.moveBackward ) {
            game.camera.position.z += game.direction.z * delta / 10;
        };
        if ( game.moveLeft || game.moveRight ) {
            game.camera.position.x += -game.direction.x * delta / 10;
        };
        if (game.moveUp || game.moveDown) {
            game.camera.position.y += game.direction.y * delta / 10;
        }

    }
}