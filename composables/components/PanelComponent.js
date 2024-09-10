import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class Panel extends Component { }
Panel.schema = {
    width: { type: Types.Number, default: 0.53 },
    height: { type: Types.Number, default: 0.3 },
    isSide: { type: Types.Boolean, default: false },
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
}