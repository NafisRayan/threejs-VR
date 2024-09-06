<script setup>
import * as THREE from 'three';
import { onMounted } from 'vue';
import { useTemplate } from '../composables/useTemplate.js';
import { loadModel } from '../composables/loadObject.js';
import { useHand } from '../composables/useHand.js';
import { register } from '../composables/src/helpers/register.js';
import { createText } from 'three/addons/webxr/Text2D.js';

const container = ref(null);
let scene, renderer, camera, controls, room, raycaster;
let controller1, controller2, controllerGrip1, controllerGrip2, handPointer1, handPointer2;
let leftHand, rightHand, world, INTERSECTION, marker, floor;
let clock;

let panel;
var object;
let menuMesh;
let exitButton, exitText;
let walkButton, cockpitButton;

const tempMatrix = new THREE.Matrix4();

let mixer;
let idle, cockpitOpen, jumpstart, inair, walk, landing;

clock = new THREE.Clock();

onMounted(() => {
    _template();
    createButton();
    createHand();

    loadedObject();
    animate();
});


const _template = () => {
    const { _create, initScene, initRenderer, initCamera, initControls, initRoom, initRaycaster, initController1, initController2, initIntersection, initFloor } = useTemplate();

    scene = initScene;
    renderer = initRenderer;
    camera = initCamera;
    controls = initControls;
    raycaster = initRaycaster;
    room = initRoom;
    controller1 = initController1;
    controller2 = initController2;
    INTERSECTION = initIntersection;
    floor = initFloor;

    _create(container.value);
}

const makeButtonMesh = (x, y, z, color) => {

    const geometry = new THREE.BoxGeometry(x, y, z);
    const material = new THREE.MeshPhongMaterial({ color: color, opacity: 0, transparent: true });
    const buttonMesh = new THREE.Mesh(geometry, material);
    return buttonMesh;

}

const createButton = () => {
    const menuGeometry = new THREE.PlaneGeometry(0.5, 0.05);
    const menuMaterial = new THREE.MeshPhongMaterial({
        opacity: 0,
        transparent: true,
    });
    menuMesh = new THREE.Mesh(menuGeometry, menuMaterial);
    menuMesh.position.set(0, -0.1, 0.001);

    exitButton = makeButtonMesh(0.1, 0.05, 0, 0xff0000);
    const exitButtonText = createText('exit', 0.03);
    exitButton.add(exitButtonText);
    exitButtonText.position.set(0, 0, 0.001);
    exitButton.position.set(-0.2, 0, 0.001);
    menuMesh.add(exitButton);

    exitText = createText('Exiting session...', 0.04);
    exitText.position.set(0, 1.5, - 0.05);
    exitText.visible = false;
    scene.add(exitText);

    walkButton = makeButtonMesh(0.1, 0.05, 0, 0xff0000);
    const walkButtonText = createText('walk', 0.03);
    walkButton.add(walkButtonText);
    walkButtonText.position.set(0, 0, 0.001);
    walkButton.position.set(-0.08, 0, 0.001);
    menuMesh.add(walkButton);

    cockpitButton = makeButtonMesh(0.1, 0.05, 0, 0xff0000);
    const cockpitButtonText = createText('Cockpit', 0.03);
    cockpitButton.add(cockpitButtonText);
    cockpitButtonText.position.set(0, 0, 0.001);
    cockpitButton.position.set(0.05, 0, 0.001);
    menuMesh.add(cockpitButton);

}



const loadedObject = () => {
    const options = {
        requiredFeatures: ['handRay'],
        isObject: true,
        isPhysique: false
    };
    loadModel('/3d-object/bipedal_mech/scene.gltf', world, options, .2, {x: 1.5, y:0, z:-2}, (model) => {
        object = model.scene;
        scene.add(object);

        // animation
        mixer = new THREE.AnimationMixer(object);
        const options = {
            requiredFeatures: ['button'], // button, draggable, handRay, instruction
            button: [
                {
                    label: 'exit',
                    mesh: exitButton,
                    output: exitText,
                    session: () => renderer.xr.getSession(),
                    onClick: () => {
                        options.button[0].output.visible = true;
                        setTimeout(function () {
                            options.button[0].output.visible = false;
                            const session = options.button[0].session();
                            if (session) {
                                session.end()
                            } else {
                                console.error('No XR session found');
                            }
                        }, 2000);
                    }
                },
                {
                    label: 'walk',
                    mesh: walkButton,
                    animations: walk,
                    onClick: () => {
                        const anim = options.button[1].animations;
                        if (anim.isRunning()) {
                            anim.stop();
                        } else {
                            anim.play();
                        }
                    }
                },
                {
                    label: 'cockpit',
                    mesh: cockpitButton,
                    animations: cockpitOpen,
                    onClick: () => {
                        const anim = options.button[2].animations;
                        if (anim.isRunning()) {
                            anim.stop();
                        } else {
                            anim.play();
                        }
                    }
                }
            ]
        };

        register(world, options);


        model.animations.forEach((clip) => {
            if (clip.name === 'Armature|Idle') {
                idle = mixer.clipAction(clip);
            } else if (clip.name === 'Armature|CockpitOpen') {
                cockpitOpen = mixer.clipAction(clip);
                options.button[2].animations = cockpitOpen;
            } else if (clip.name === 'Armature|JumpStart') {
                jumpstart = mixer.clipAction(clip);
            } else if (clip.name === 'Armature|InAir') {
                inair = mixer.clipAction(clip);
            } else if (clip.name === 'Armature|Landing') {
                landing = mixer.clipAction(clip);
            } else if (clip.name === 'Armature|Walk') {
                walk = mixer.clipAction(clip);
                options.button[1].animations = walk;
            }
        });

    }
    );
}

const createHand = () => {
    const {
        controllerGripLeft, controllerGripRight, left, right, handPointerLeft, handPointerRight, initWorld
    } = useHand(controller1, controller2, renderer);

    controllerGrip1 = controllerGripLeft;
    controllerGrip2 = controllerGripRight;
    handPointer1 = handPointerLeft;
    handPointer2 = handPointerRight;
    leftHand = left;
    rightHand = right;
    world = initWorld;

    scene.add(controllerGrip1);
    scene.add(controllerGrip2);
    scene.add(handPointer1);
    scene.add(handPointer2);
    scene.add(leftHand);
    scene.add(rightHand);

    panel = {
        layers: 3,
        color: '#1A1A1A',
        scene: scene,
        renderer: renderer,
        isSide: true,
        camera: camera,
        padding: 0.025,
        position: { x: -1.5, y: 2, z: -2 }, // position: { x: 1, y: 2, z: -2 },
        rotation: { x: 0, y: 0, z: 0 }, // rotation: { x: 0, y: -90, z: 0 },
        menuContainer: menuMesh
    }

    const options = {
        requiredFeatures: ['instruction', 'handRay', 'draggable', 'panel'], // button, draggable, handRay, instruction
        handPointers: [handPointer1, handPointer2],
        controllers: [controller1, controller2],
        panel: [panel],
    };
    register(world, options);
}

const animate = () => {

    renderer.setAnimationLoop(() => {
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        const elapsedTime = clock.elapsedTime;
        world.execute(delta, elapsedTime);
        controls.update();

        // INTERSECTION = undefined;
        // if (controller1.userData.isSelecting === true) {

        //     tempMatrix.identity().extractRotation(controller1.matrixWorld);

        //     raycaster.ray.origin.setFromMatrixPosition(controller1.matrixWorld);
        //     raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

        //     const intersects = raycaster.intersectObjects([floor]);

        //     if (intersects.length > 0) {

        //         INTERSECTION = intersects[0].point;

        //     }

        // } else if (controller2.userData.isSelecting === true) {

        //     tempMatrix.identity().extractRotation(controller2.matrixWorld);

        //     raycaster.ray.origin.setFromMatrixPosition(controller2.matrixWorld);
        //     raycaster.ray.direction.set(0, 0, - 1).applyMatrix4(tempMatrix);

        //     const intersects = raycaster.intersectObjects([floor]);

        //     if (intersects.length > 0) {

        //         INTERSECTION = intersects[0].point;

        //     }

        // }
        // if (INTERSECTION) marker.position.copy(INTERSECTION);

        // marker.visible = INTERSECTION !== undefined;

        renderer.render(scene, camera);
    });
}
</script>

<template>
    <div ref="container" style="overflow: hidden;"></div>
</template>