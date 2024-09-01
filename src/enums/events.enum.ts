export enum Event {
  TICK,
  KEY_DOWN,
  KEY_UP,
  RESIZE,
  LEFT_CLICK,
  RIGHT_CLICK,
  WHEEL,
  POINTER_MOVE,
  POINTER_DOWN,
  POINTER_UP,
  //
  CURSOR_MOVE,
  FPS,

  //
  SAFE_AREA_INSET_TOP,
  SAFE_AREA_INSET_RIGHT,
  SAFE_AREA_INSET_BOTTOM,
  SAFE_AREA_INSET_LEFT,

  TITLEBAR_AREA_X,
  TITLEBAR_AREA_Y,
  TITLEBAR_AREA_WIDTH,
  TITLEBAR_AREA_HEIGHT,

  KEYBOARD_INSET_TOP,
  KEYBOARD_INSET_RIGHT,
  KEYBOARD_INSET_BOTTOM,
  KEYBOARD_INSET_LEFT,
  KEYBOARD_INSET_WIDTH,
  KEYBOARD_INSET_HEIGHT,
}

export enum DisplayObjectEvent {
  //Prevent the use of other than POINTER

  //### PIXI ########################################################################################################//
  GLOBAL_POINTER_MOVE = "globalpointermove",
  POINTER_CANCEL = "pointercancel",
  POINTER_CANCEL_CAPTURE = "pointercancelcapture",
  POINTER_DOWN = "pointerdown",
  POINTER_DOWN_CAPTURE = "pointerdowncapture",
  POINTER_ENTER = "pointerenter",
  POINTER_ENTER_CAPTURE = "pointerentercapture",
  POINTER_LEAVE = "pointerleave",
  POINTER_LEAVE_CAPTURE = "pointerleavecapture",
  POINTER_MOVE = "pointermove",
  POINTER_MOVE_CAPTURE = "pointermovecapture",
  POINTER_OUT = "pointerout",
  POINTER_OUT_CAPTURE = "pointeroutcapture",
  POINTER_OVER = "pointerover",
  POINTER_OVER_CAPTURE = "pointerovercapture",
  POINTER_TAP = "pointertap",
  POINTER_TAP_CAPTURE = "pointertapcapture",
  POINTER_UP = "pointerup",
  POINTER_UP_CAPTURE = "pointerupcapture",
  POINTER_UP_OUTSIDE = "pointerupoutside",
  POINTER_UP_OUTSIDE_CAPTURE = "pointerupoutsidecapture",
  ADDED = "added",
  REMOVED = "removed",
  DESTROYED = "destroyed",

  //### CUSTOM ########################################################################################################//
  TICK = "@custom/tick",
  CONTEXT_ENTER = "@custom/context_enter",
  CONTEXT_LEAVE = "@custom/context_leave",
  CONTEXT_FORWARD = "@custom/context_forward",
  CONTEXT_BACKWARD = "@custom/context_backward",
  CONTEXT_DOWN = "@custom/context_down",
  CONTEXT_UP = "@custom/context_up",
  ADD_CHILD = "@custom/add_child",
  REMOVE_CHILD = "@custom/remove_child",
  VISIBILITY_CHANGE = "@custom/visibility_change",
}

// CLICK = "click",
// CLICK_CAPTURE = "clickcapture",
// GLOBAL_MOUSE_MOVE = "globalmousemove",
// GLOBAL_TOUCH_MOVE = "globaltouchmove",
// MOUSE_DOWN = "mousedown",
// MOUSE_DOWN_CAPTURE = "mousedowncapture",
// MOUSE_ENTER = "mouseenter",
// MOUSE_ENTER_CAPTURE = "mouseentercapture",
// MOUSE_LEAVE = "mouseleave",
// MOUSE_LEAVE_CAPTURE = "mouseleavecapture",
// MOUSE_MOVE = "mousemove",
// MOUSE_MOVE_CAPTURE = "mousemovecapture",
// MOUSE_OUT = "mouseout",
// MOUSE_OUT_CAPTURE = "mouseoutcapture",
// MOUSE_OVER = "mouseover",
// MOUSE_OVER_CAPTURE = "mouseovercapture",
// MOUSE_UP = "mouseup",
// MOUSE_UP_CAPTURE = "mouseupcapture",
// MOUSE_UP_OUTSIDE = "mouseupoutside",
// MOUSE_UP_OUTSIDE_CAPTURE = "mouseupoutsidecapture",
// RIGHT_CLICK = "rightclick",
// RIGHT_CLICK_CAPTURE = "rightclickcapture",
// RIGHT_DOWN = "rightdown",
// RIGHT_DOWN_CAPTURE = "rightdowncapture",
// RIGHT_UP = "rightup",
// RIGHT_UP_CAPTURE = "rightupcapture",
// RIGHT_UP_OUTSIDE = "rightupoutside",
// RIGHT_UP_OUTSIDE_CAPTURE = "rightupoutsidecapture",
// TAP = "tap",
// TAP_CAPTURE = "tapcapture",
// TOUCH_CANCEL = "touchcancel",
// TOUCH_CANCEL_CAPTURE = "touchcancelcapture",
// TOUCH_END = "touchend",
// TOUCH_END_CAPTURE = "touchendcapture",
// TOUCH_END_OUTSIDE = "touchendoutside",
// TOUCH_END_OUTSIDE_CAPTURE = "touchendoutsidecapture",
// TOUCH_MOVE = "touchmove",
// TOUCH_MOVE_CAPTURE = "touchmovecapture",
// TOUCH_START = "touchstart",
// TOUCH_START_CAPTURE = "touchstartcapture",
// WHEEL = "wheel",
// WHEEL_CAPTURE = "wheelcapture",
