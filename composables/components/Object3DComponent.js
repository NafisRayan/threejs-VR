import { Component, Types } from 'three/addons/libs/ecsy.module.js';

export class Object3D extends Component { }
Object3D.schema = {
    object: { type: Types.Ref }
};
