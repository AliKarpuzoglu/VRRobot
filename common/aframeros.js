
/**
 * we use this file for our ros3djs/roslibjs code
 */

var menuOpen = false;
var rootObjectNode // the Aframe node to which we will add children nodes to add visualizations to
// we need to add child nodes for the visualization because otherwise some things will only be partially loaded
let ip = "192.168.0.8" 
let used_visualisations = {} // a dictionary for which visualizations we use
let used_controls  = {} // a dictionary for the controls we use with the robot





function generateMenuOfVisualizations(){

    var container = document.createElement("a-gui-flex-container")
    

    container.setAttribute("id","menu-gui")
    container.setAttribute("flex-direction","column" )
    container.setAttribute("visible","false" )
    container.setAttribute("justify-content","center")
    container.setAttribute("align-items","normal")
    container.setAttribute("component-padding","0.1")
    container.setAttribute("opacity","0.7")
    container.setAttribute("width","3.5" )
    container.setAttribute("height", "4.5")
    container.setAttribute("position","0 5 -3") 
    container.setAttribute("rotation","0 0 0")
    console.log("container done")

    var button = document.createElement("a-gui-button") 
    
    button.setAttribute("width","2.5")
    button.setAttribute("height","0.75") 
    button.setAttribute("onclick","teleportToRobot" )
    button.setAttribute("key-code","32") 
    button.setAttribute("value","teleport to robot") 
    button.setAttribute("margin","0 0 0.05 0")
    container.appendChild(button)

    // for each visualization in used_visualizations
    // create a gui toggle
    for ( visualization in used_visualisations){
        console.log(visualization)
         // check if the property/key is defined in the object itself, not in parent
        if (used_visualisations.hasOwnProperty(visualization)) {  
            var toggle = document.createElement("a-gui-toggle") 
            toggle.setAttribute("width","2.5") 
            toggle.setAttribute("height","0.75") 
            toggle.setAttribute("onclick","toggleTopic" )
            toggle.setAttribute("value", visualization)
            toggle.setAttribute("margin","0 0 0.05 0")
            toggle.setAttribute("toggle",true )
            toggle.setAttribute("checked",true)// or false  depending on whether it's on by default)
            container.appendChild(toggle)
        }
    }
    // <a-gui-toggle width="2.5" height="0.75" onclick="toggleTopic" value="cloudClient" margin="0 0 0.05 0">
    // </a-gui-toggle>
    // <a-gui-toggle width="2.5" height="0.75" onclick="toggleTopic" value="markerClient" margin="0 0 0.05 0">
    // </a-gui-toggle>
    // <a-gui-toggle width="2.5" height="0.75" onclick="toggleTopic" value="gridClient" margin="0 0 0.05 0">
    // </a-gui-toggle>
    // <!-- <a-gui-toggle width="2.5" height="0.75" onclick="toggleTopic" value="urdf" margin="0 0 0.05 0">
    // </a-gui-toggle> -->

    return container
}
/**
 * this reads a json config to add ros3djs functions 
 * @param {} json 
 */
function addall(json){


}
function addControls(name,type,options){
    controls = new type(options)
    used_controls[name] = controls
    return controls
}

function addVisualization(rootNode,name,type,options,enabled=true){
    if(enabled){
    node = document.createElement("a-entity");
    rootNode.appendChild(node)
    options.rootObject = node.object3D

    visualization = new type(options)
    used_visualisations[name]= visualization
    return visualization
    }


}


/**
 * This function turns a specific visualization on or off
 * 
 * 
 * sadly the toggle does not pass any "toggled" flag as far as I can tell, so as of now these things just behave like buttons
 * We have two options to check for the toggle, one way is to see if the object is visible 
 * The nicer option would be to check for a subscribeId but we have had issues when using the subscribeId using the occupancymap
 * @param {} click the fired event when clicking/toggling a topic
 */
function toggleTopic(click) {
    console.log(click)
    topicName = click.target.getAttribute("value")
    // console.log(used_visualisations[topicName].rosTopic.subscribeId)

    var hasTopic = used_visualisations[topicName].rosTopic
    if (!hasTopic){
        used_visualisations[topicName].rootObject.visible = !used_visualisations[topicName].rootObject.visible
        return;
    }
    var has_sub_id = used_visualisations[topicName].rosTopic.subscribeId // it has a subscribeID -- Maybe we should check if it's visible instead?
    var something_is_visible = used_visualisations[topicName].rootObject && used_visualisations[topicName].rootObject.visible
    || used_visualisations[topicName].points && used_visualisations[topicName].points.rootObject.visible 
    if ( something_is_visible )  { 
        if (used_visualisations[topicName].rootObject) { // points object doesnt immediately have the rootObject - TODO: this needs to be adapted whenever we toggle topics
            used_visualisations[topicName].rootObject.visible = false

        } else {
            used_visualisations[topicName].points.rootObject.visible = false
        }
        used_visualisations[topicName].unsubscribe()
        return
    } else {
        if (used_visualisations[topicName].rootObject) { // points object doesnt immediately have the rootObject - TODO: this needs to be adapted whenever we toggle topics
            used_visualisations[topicName].rootObject.visible = true

        } else {
            used_visualisations[topicName].points.rootObject.visible = true

        }
        used_visualisations[topicName].subscribe()
        console.log("subscribe")
        return

    }

}



/**
 * Rescaling the scene 
 * @param {*} click 
 * @param {*} percent 
 */
function rescaleaction(click, percent) {
    console.log(percent)
    scale_string = percent + " " + percent + " " + percent
    rootObjectNode.setAttribute("scale", scale_string)

}



/**
 * Instead of taking the parameters, we also want to be able to work if someone moves diagonally
 * so instead of just taking the movement and publishing it - which only publishes one of two commands, we will try to
 * publish one at a time
 * 
 * this works well when using a controller with a joystick/ diagonal movements, but this needs to be configured for keyboards 
 * eg: make clicking forward and left into one message instead of two
 * 
 * 
 * @param {*} x linear x 
 * @param {*} y linear y
 * @param {*} z  linear z
 * @param {*} a angular x
 * @param {*} b angular y
 * @param {*} c angular z
 */
function moveRobot(arr){
    // console.log(x)
    // var arr = [x,y,z,a,b,c]
    // var newVelocities = zvelocities.map((a, i) => clamp(a + arr[i],-1,1));
    velocities = arr
    console.log(velocities)
    // var newVelocities = [0,0,0,0,0,0]

      var twist = new ROSLIB.Message({
        linear : {
          x : velocities[0],
          y : velocities[1],
          z : velocities[2]
        },
        angular : {
          x : velocities[3],
          y : velocities[4],
          z : velocities[5]
        }
      });
      used_controls['cmd_vel'].publish(twist);
}
