import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { FBXLoader } from "three/addons/loaders/FBXLoader.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { Object3D } from './src/components/Object3DComponent.js';
import { Intersectable } from './src/components/intersectableComponent.js';
import * as THREE from 'three';

/**
 * Memuat model 3D dari file dan menambahkannya ke dunia (world).
 * 
 * @param {string} filePath - Jalur ke file model.
 * @param {object} world - Dunia (world) tempat model akan ditambahkan.
 * @param {object} [options={}] - Opsi tambahan dengan nilai default.
 * @param {number} [scale=1] - Skala model saat di-load.
 * @param {function} callback - Fungsi callback yang akan dipanggil setelah model dimuat.
 */
export const loadModel = (filePath, world, options = {}, scale = 1, callback) => {
    const { requiredFeatures = [], isObject = false, isPhysique = false } = options;

    let loader;

    const x = filePath.split("/");
    const y = x[x.length - 1];
    const z = y.split(".");
    const type = z[z.length - 1];

    switch (type) {
        case 'glb':
        case 'gltf':
            loader = new GLTFLoader();
            break;
        case 'fbx':
            loader = new FBXLoader();
            break;
        case 'obj':
            loader = new OBJLoader();
            break;
        default:
            console.error(`Unsupported file type: ${type}`);
            return;
    }

    loader.load(
        filePath,
        (loadedModel) => {
            if (!loadedModel) {
                console.error('Model is undefined.');
                return;
            }

            if (loadedModel.scene) {
                loadedModel.scene.scale.set(scale, scale, scale);
            }

            const entity = world.createEntity();
            requiredFeatures.forEach(val => {
                if (val === 'handRay') {
                    entity.addComponent(Intersectable);
                }
                if (isObject && loadedModel.scene) {
                    entity.addComponent(Object3D, { object: loadedModel.scene });
                    loadedModel.scene.position.z = -2;
                }
            });

            if (callback) {
                callback(loadedModel);
            }
        },
        undefined,
        (error) => {
            console.error('An error occurred while loading the model:', error);
        }
    );
};
