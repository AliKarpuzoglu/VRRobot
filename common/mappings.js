// for info https://aframe.io/docs/1.0.0/components/vive-controls.html#events
// 
var mappings = {
  default: {
    'vive-controls': {
      trackpaddown: 'teleport'
    },

    'oculus-touch-controls': {
      xbuttondown: 'teleport'
    },
    keyboard: {
      't_down': 'teleportstart',
      't_up': 'teleportend',
      'm_up': 'openMenu',
    }
  },
 
  mappings: {
    task1: {
    common: {
      triggerdown: {left: 'lefthand', right: 'righthand'}
    },
    'vive-controls': {
      'grip.down': 'changeTask',
      'trackpad.up': 'teleportend',
      'trackpad.down': 'teleportstart',
      'trackpad.doubletouch': 'openMenu',
      'trackpad.doublepress': 'doublepress',
      // Activators for down, up, touchstart and touchend are optionals you can just write the event without the .
      'trackpaddpadleftdown': 'dpadleft',
      'trackpaddpadright.longpress': 'dpadrightlong'
    },
    'oculus-touch-controls': {
      'abutton.down': 'teleportstart',
      'abutton.up': 'teleportend',
      'xbutton.up': 'openMenu'

    },
    'windows-motion-controls': {
      'grip.down': 'changeTask'
    },
    keyboard: {
      't_down': 'teleportstart',
      't_up': 'teleportend',
      'c_up': 'changeTask',
      'm_up': 'openMenu'

    }
  }
  }
};

AFRAME.registerInputMappings(mappings);
var inputActions = {
  task1: {
    openMenu: { label : 'Open Menu'},
    dpadleft : { label : 'DpadLeft'},
    changeTask: { label: 'Change task' },
    logdefault: { label: 'Test Log' },
    logtask1: { label: 'Test Log Task 1' }, 
    logtask2: { label: 'Test Log Task 2' },
    lefthand: { label: 'Left hand' },// the trigger on the back
    righthand: { label: 'Right hand' }, // the trigger on the back
    longpress: { label: 'Long press' },
    doubletouch: { label: 'Double touch' },
    doublepress: { label: 'Double press' },
    dpadrightlong: { label: 'dpadrightlong'}
  },
  controls: {
    openMenu: { label : 'openMenu'},
    logtask2: { label: 'Test Log Task 2' }
  }
}

AFRAME.registerInputActions(inputActions, 'task1');