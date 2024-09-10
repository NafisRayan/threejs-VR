import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';
import { OculusHandModel } from 'three/addons/webxr/OculusHandModel.js';
import { OculusHandPointerModel } from 'three/addons/webxr/OculusHandPointerModel.js';
import { World } from 'three/addons/libs/ecsy.module.js';

export const useHand = (controller1, controller2, renderer) => {
    try {
        let initWorld = new World();
        const controllerModelFactory = new XRControllerModelFactory();

        const controllerGripLeft = renderer.xr.getControllerGrip(0);
        controllerGripLeft.add(controllerModelFactory.createControllerModel(controllerGripLeft));

        const controllerGripRight = renderer.xr.getControllerGrip(1);
        controllerGripRight.add(controllerModelFactory.createControllerModel(controllerGripRight));

        const left = renderer.xr.getHand(0);
        left.add(new OculusHandModel(left));
        const handPointerLeft = new OculusHandPointerModel(left, controller1);
        left.add(handPointerLeft);

        const right = renderer.xr.getHand(1);
        right.add(new OculusHandModel(right));
        const handPointerRight = new OculusHandPointerModel(right, controller2);
        right.add(handPointerRight);


        return {
            controllerGripLeft, controllerGripRight, left, right, handPointerLeft, handPointerRight, initWorld
        }
    } catch (error) {
        console.error('error in ', + error);
    }
}