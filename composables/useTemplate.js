import * as THREE from 'three';
import { VRButton } from 'three/examples/jsm/webxr/VRButton.js';
import { BoxLineGeometry } from 'three/examples/jsm/geometries/BoxLineGeometry.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export const useTemplate = () => {
    let initScene, initRenderer, initCamera, initController1, initController2;
    let initRoom, initControls;
    let initRaycaster, initIntersection, initMarker, initFloor, baseReferenceSpace;

    let select = false;

    const onSelectStart = () => {
        select = true;
    }

    const onSelectEnd = () => {
        select = false;
        if (initIntersection) {
            const offsetPosition = { x: - INTERSECTION.x, y: - INTERSECTION.y, z: - INTERSECTION.z, w: 1 };
            const offsetRotation = new THREE.Quaternion();
            const transform = new XRRigidTransform(offsetPosition, offsetRotation);
            const teleportSpaceOffset = baseReferenceSpace.getOffsetReferenceSpace(transform);

            initRenderer.xr.setReferenceSpace(teleportSpaceOffset);
        }
    }

    // raycaster
    initRaycaster = new THREE.Raycaster();

    // Scene
    initScene = new THREE.Scene();
    initScene.background = new THREE.Color(0x505050);

    // Cahaya
    initScene.add(new THREE.HemisphereLight(0xa5a5a5, 0x898989, 3));
    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(1, 1, 1).normalize();
    initScene.add(light);

    // Kamera
    initCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 10);
    initCamera.position.set(0, 1, 3);

    // Ruangan
    initRoom = new THREE.LineSegments(
        new BoxLineGeometry(6, 6, 6, 10, 10, 10).translate(0, 3, 0),
        new THREE.LineBasicMaterial({ color: 0xbcbcbc })
    );
    initScene.add(initRoom);

    // Renderer
    initRenderer = new THREE.WebGLRenderer({ antialias: true });
    initRenderer.setPixelRatio(window.devicePixelRatio);
    initRenderer.setSize(window.innerWidth, window.innerHeight);
    initRenderer.xr.addEventListener('sessionstart', () => {
        baseReferenceSpace = initRenderer.xr.getReferenceSpace();
    });
    initRenderer.xr.enabled = true;

    // marker
    initMarker = new THREE.Mesh(
        new THREE.CircleGeometry(0.25, 32).rotateX(- Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xbcbcbc })
    );
    initScene.add(initMarker);

    // floor
    initFloor = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6, 2, 2).rotateX(- Math.PI / 2),
        new THREE.MeshBasicMaterial({ color: 0xbcbcbc, transparent: true, opacity: 0.25 })
    );
    initScene.add(initFloor);

    // Kontrol orbit
    initControls = new OrbitControls(initCamera, initRenderer.domElement);
    initControls.target = new THREE.Vector3(0, 1.2, -1);

    // controller
    initController1 = initRenderer.xr.getController(0);
    initController2 = initRenderer.xr.getController(1);

    initController1.addEventListener('selectstart', onSelectStart);
    initController1.addEventListener('selectend', onSelectEnd);
    initController1.addEventListener('connected', function (event) {

        this.add(buildController(event.data));

    });
    initController1.addEventListener('disconnected', function () {

        this.remove(this.children[0]);

    });
    initController2.addEventListener('selectstart', onSelectStart);
    initController2.addEventListener('selectend', onSelectEnd);
    initController2.addEventListener('connected', function (event) {

        this.add(buildController(event.data));

    });
    initController2.addEventListener('disconnected', function () {

        this.remove(this.children[0]);

    });

    initScene.add(initController1);
    initScene.add(initController2);

    const _create = (Container) => {
        // VR
        const sessionInit = {
            requiredFeatures: ['hand-tracking']
        };

        Container.appendChild(initRenderer.domElement);
        Container.appendChild(VRButton.createButton(initRenderer, sessionInit));
    }



    const buildController = (data) => {
        let geometry, material;

        switch (data.targetRayMode) {

            case 'tracked-pointer':

                geometry = new THREE.BufferGeometry();
                geometry.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0, 0, 0, - 1], 3));
                geometry.setAttribute('color', new THREE.Float32BufferAttribute([0.5, 0.5, 0.5, 0, 0, 0], 3));

                material = new THREE.LineBasicMaterial({ vertexColors: true, blending: THREE.AdditiveBlending });

                return new THREE.Line(geometry, material);

            case 'gaze':

                geometry = new THREE.RingGeometry(0.02, 0.04, 32).translate(0, 0, - 1);
                material = new THREE.MeshBasicMaterial({ opacity: 0.5, transparent: true });
                return new THREE.Mesh(geometry, material);

        }
    }

    return {
        _create,
        initScene,
        initRenderer,
        initCamera,
        initControls,
        initRoom,
        initRaycaster,
        initController1,
        initController2,
        initIntersection,
        initMarker,
        initFloor
    }
}


