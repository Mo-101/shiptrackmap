
import { createLineAnimation, updateLineAnimation } from './lineAnimation';
import { createMovingDotAnimation, updateDotPosition } from './dotAnimation';
import { animateShipmentRoute } from './routeAnimation';

export {
  createLineAnimation,
  updateLineAnimation,
  createMovingDotAnimation,
  updateDotPosition,
  animateShipmentRoute
};

// Export as default for backward compatibility
export default {
  createLineAnimation,
  updateLineAnimation,
  createMovingDotAnimation,
  updateDotPosition,
  animateShipmentRoute
};
