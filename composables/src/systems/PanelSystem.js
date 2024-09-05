import { System } from 'three/addons/libs/ecsy.module.js';
import * as THREE from 'three';
import { Panel } from '../components/PanelComponent.js';

export class PanelSystem extends System {
  init({ panel }) {
    this.panel = panel;
    this.panelGroup = new THREE.Group();
    if (this.panel.length > 0 && this.panel[0].scene) {
      this.panel[0].scene.add(this.panelGroup);
    }

    this.panelMeshes = [];
    this.createPanel();
  }

  execute() {
    if (this.panel.length > 0) {
      this.panelGroup.rotation.set(
        this.rotation.x * (Math.PI / 180),
        this.rotation.y * (Math.PI / 180),
        this.rotation.z * (Math.PI / 180)
      );
    }

    this.renderer.render(this.scene, this.camera);
  }

  getPanelGroup () {
    return this.panelGroup;
  }

  createPanel() {
    let panel, xOffset;

    this.panel.forEach(p => {
      this.chord = p.chord !== undefined ? p.chord : Panel.schema.chord.default;
      this.layers = p.layers !== undefined ? p.layers : Panel.schema.layers.default;
      this.width = p.width !== undefined ? p.width : Panel.schema.width.default;
      this.height = p.height !== undefined ? p.height : Panel.schema.height.default;
      this.color = p.color !== undefined ? p.color : Panel.schema.color.default;
      this.scene = p.scene || this.scene;
      this.renderer = p.renderer || this.renderer;
      this.camera = p.camera || this.camera;
      this.isSide = p.isSide !== undefined ? p.isSide : Panel.schema.isSide.default;
      this.padding = p.padding !== undefined ? p.padding : Panel.schema.padding.default;
      this.position = p.position || Panel.schema.position.default;
      this.rotation = p.rotation || Panel.schema.rotation.default;
      this.menuContainer = p.menuContainer || this.menuContainer

    });

    if (this.layers > 3) {
      console.warn("Layers harus kurang dari 3");
    } else {
      for (let i = 0; i < this.layers; i++) {
        const geometry = new THREE.PlaneGeometry(this.width, this.height);
        const side = this.isSide === true ? THREE.DoubleSide : THREE.FrontSide;
        const material = new THREE.MeshBasicMaterial({ color: this.color, side: side });

        panel = new THREE.Mesh(geometry, material);
        if (i === 0) {
          xOffset = 0;
          panel.position.set(this.position.x + xOffset, this.position.y, this.position.z - 0.08);
        } else {
          if (i % 2 !== 0) {
            xOffset = - (this.width + this.padding);
            panel.rotation.set(0, (15 * (Math.PI / 180)), 0);
            panel.position.set(this.position.x + xOffset, this.position.y, this.position.z);
          } else {
            xOffset = (this.width + this.padding);
            panel.rotation.set(0, -(15 * (Math.PI / 180)), 0);
            panel.position.set(this.position.x + xOffset, this.position.y, this.position.z);
          }
        }

        this.panelGroup.add(panel);
        this.panelMeshes.push(
          {
            panel,
            scene: this.scene,
            camera: this.camera,
            renderer: this.renderer
          }
        );
      }

      if (this.menuContainer !== null) {
        panel.add(this.menuContainer)
      }
    }
  }

  // createKeyboard() {

  //   // keyboard base
  //   const geometry = new THREE.PlaneGeometry(0.5, 0.18);
  //   const side = this.isSide === true ? THREE.DoubleSide : THREE.FrontSide;
  //   const material = new THREE.MeshBasicMaterial({ color: this.color, side: side });

  //   this.keyboard = new THREE.Mesh(geometry, material);
  //   this.keyboard.position.set(this.position.x, this.position.y - 0.3, this.position.z + 0.1); // Posisi relatif terhadap panel
  //   this.keyboard.rotation.set(15, 0, 0);
  //   this.panelGroup.add(this.keyboard);

  //   fetch('/fonts/keyboardButton.json')
  //     .then(response => response.json())
  //     .then(data => {
  //       data.keyboard.forEach((row, index) => {
  //         this.createButton(row, index)
  //       });
  //     })
  //     .catch(error => console.log(error));
  // }


  // createButton(item, index) {
  //   let button;
  //   if (index === 0) {
  //     item.keys.forEach((row, rowIndex) => {
  //       const geometry = new THREE.PlaneGeometry(row.width, row.height);
  //       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  //       button = new THREE.Mesh(geometry, material);
  //       button.rotation.set(0, 180 * (Math.PI / 180), 0)
  //       button.position.set(-0.23 + (rowIndex / (item.keys.length + 15)), -0.05, -0.005);

  //       this.keyboard.add(button);
  //     });
  //   } else if (index === 1) {
  //     item.keys.forEach((row, rowIndex) => {
  //       const geometry = new THREE.PlaneGeometry(row.width, row.height);
  //       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  //       button = new THREE.Mesh(geometry, material);
  //       button.rotation.set(0, 180 * (Math.PI / 180), 0)
  //       button.position.set(-0.23 + (rowIndex / (item.keys.length + 15)), -0.02, -0.005);

  //       this.keyboard.add(button);
  //     });
  //   } else if (index === 2) {
  //     item.keys.forEach((row, rowIndex) => {
  //       const width = rowIndex !== item.keys.length - 1 ? row.width : row.width + 0.015;
  //       const xOffset = rowIndex !== item.keys.length - 1 ? -0.23 + (rowIndex / (item.keys.length + 15)) : -0.23 + (rowIndex / (item.keys.length + 15) + 0.010)

  //       const geometry = new THREE.PlaneGeometry(width, row.height);
  //       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  //       button = new THREE.Mesh(geometry, material);
  //       button.rotation.set(0, 180 * (Math.PI / 180), 0)
  //       button.position.set(xOffset, 0.01, -0.005);

  //       this.keyboard.add(button);
  //     });
  //   } else if (index === 3) {
  //     item.keys.forEach((row, rowIndex) => {
  //       const width = rowIndex !== 11 && rowIndex !== 0  ? row.width: ( rowIndex === 0 ? row.width + 0.025 : row.width + 0.025);
  //       const xOffset = rowIndex !== 11 ? -0.216 + (rowIndex / (item.keys.length + 15)) : -0.23 + (rowIndex / (item.keys.length + 15) + 0.03);

  //       const geometry = new THREE.PlaneGeometry(width, row.height);
  //       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  //       button = new THREE.Mesh(geometry, material);
  //       button.rotation.set(0, 180 * (Math.PI / 180), 0)
  //       button.position.set(xOffset, 0.04, -0.005);

  //       this.keyboard.add(button);
  //     });
  //   } else {
  //     item.keys.forEach((row, rowIndex) => {
  //       const geometry = new THREE.PlaneGeometry(row.width, row.height);
  //       const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.FrontSide });
  //       button = new THREE.Mesh(geometry, material);
  //       button.rotation.set(0, 180 * (Math.PI / 180), 0)
  //       button.position.set(0.005, 0.07, -0.005);

  //       this.keyboard.add(button);
  //     });
  //   }

  // }
}


PanelSystem.queries = {
  panel: { components: [Panel] }
};
