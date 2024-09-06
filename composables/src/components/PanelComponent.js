import { Mesh, MeshPhongMaterial, PerspectiveCamera, PlaneGeometry, Scene, WebGLRenderer } from 'three';
import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class Panel extends Component { }
Panel.schema = {
    width: { type: Types.Number, default: 0.53 },
    height: { type: Types.Number, default: 0.3 },
    scene: { type: Types.Ref},
    world: { type: Types.Ref},
    renderer: { type: Types.Ref},
    camera: { type: Types.Ref},
    color: { type: Types.String, default: '#00ff00' },
    isSide: { type: Types.Boolean, default: false },
    layers: { type: Types.Number, default: 1 },
    padding: { type: Types.Number, default: 0 },
    position: {
        type: Types.Ref,
        default: { x: 0, y: 0, z: 0 },
        parse: (value) => ({ x: Number(value.x), y: Number(value.y), z: Number(value.z) })
    },
    rotation: {
        type: Types.Ref,
        default: { x: 0, y: 0, z: 0 },
        parse: (value) => ({ x: Number(value.x), y: Number(value.y), z: Number(value.z) })
    },
    menuContainer: { type: Types.Ref},
    chord: { type: Types.String, default: '/fonts/keyboardButton.json' }
};
