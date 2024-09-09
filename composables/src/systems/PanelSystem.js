import { System } from 'three/addons/libs/ecsy.module.js';
import { Panel } from '../components/PanelComponent';
import { Object3D } from '../components/Object3DComponent';
import * as THREE from 'three';

export class PanelSystem extends System {

    execute() {
        this.queries.panel.results.forEach(entity => {
            const panel = entity.getMutableComponent(Panel);
            const panelMesh = entity.getComponent(Object3D).object;

            // atur rotasi
            if (
                panel.rotation.x !== panel.prevRotation?.x ||
                panel.rotation.y !== panel.prevRotation?.y ||
                panel.rotation.z !== panel.prevRotation?.z
            ) {

                panelMesh.rotation.set(
                    panel.rotation.x * (Math.PI / 180),
                    panel.rotation.y * (Math.PI / 180),
                    panel.rotation.z * (Math.PI / 180)
                );

                panel.prevRotation = { ...panel.rotation };
            }

            // atur posisi
            if (
                panel.position.x !== panel.prevPosition?.x ||
                panel.position.y !== panel.prevPosition?.y ||
                panel.position.z !== panel.prevPosition?.z
            ) {
                panelMesh.position.set(
                    panel.position.x,
                    panel.position.y,
                    panel.position.z
                )
                panel.prevPosition = { ...panel.position }
            }

            // atur sisi panel
            if (panel.isSide !== panel.prevIsSide) {
                if (panelMesh.material) {
                    if (panel.isSide === true) {
                        panelMesh.material.side = THREE.DoubleSide;
                    } else {
                        panelMesh.material.side = THREE.FrontSide;
                    }
                }
                panel.prevIsSide = panel.isSide;
            }

            // atur width
            if (panel.width !== panel.prevWidth || panel.height !== panel.prevHeight) {
                const newGeometry = new THREE.PlaneGeometry(panel.width, panel.height);

                panelMesh.geometry.dispose(); 
                panelMesh.geometry = newGeometry; 

                panel.prevWidth = panel.width;
                panel.prevHeight = panel.height;
            }

        });
    }
}

PanelSystem.queries = {
    panel: { components: [Panel] }
};
