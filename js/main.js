var scheduledEvents = function(events) {
    var events = events;
    var collisions = [];
    //resets storage
    var width = [];
    var leftOffSet = [];
  
    var containerHeight = 720;
    var containerWidth = 600;
    var minutesInDay = 60 * 12;
  
    var getCollisions = function() {
      collisions = [];
      for (var i = 0; i < 24; i ++) {
        var time = [];
        for (var j = 0; j < events.length; j++) {
          time.push(0);
        }
        collisions.push(time);
      }
      events.forEach(function(event, id){
        let end = event.end;
        let start = event.start;
        let order = 1;
        while (start < end) {
          timeIndex = Math.floor(start/30);
          while (order < events.length) {
            if (collisions[timeIndex].indexOf(order) === -1) {
              break;
            }
            order ++;
          }
          collisions[timeIndex][id] = order;
          start = start + 30;
        }
        collisions[Math.floor((end-1)/30)][id] = order;
      });
    }
  
    var getAttributes = function() {
      width = [];
      leftOffSet = [];
    
      for (var i = 0; i < events.length; i++) {
        width.push(0);
        leftOffSet.push(0);
      }
  
      collisions.forEach(function(period){
    
        let count = period.reduce(function(a,b) {
          return b ? a + 1 : a;
        })
        if (count > 1) {
          period.forEach(function(event, id) {
            if (period[id]) {
              if (count > width[id]) {
                width[id] = count;
              }
            }
            if (period[id] && !leftOffSet[id]) {
              leftOffSet[id] = period[id];
            }
          })
        }
      });
    }
  
      /**
       * This function displays the event div in a container
       * @param height
       * @param top
       * @param left
       * @param units
       */
    var renderEvent = function(height, top, left, units) {
      let node = document.createElement("div");
      node.className = "event";
      node.innerHTML = 
      "<span class='title'> Sample Item </span> \
      <br><span class='location'> Sample Location </span>";
        // Customized CSS to position each event
      node.style.width = (containerWidth/units) + "px";
      node.style.height = height + "px";
      node.style.top =  top + "px";
      node.style.left = 450 + left + "px";
    
      document.getElementById("events").appendChild(node);
    }
  
      /**
       * This function gets all properties required to display event
       */
    this.render = function() {
      console.log(events);
      
      var myNode = document.getElementById("events");
      myNode.innerHTML = '';
  
      getCollisions();
      getAttributes();
  
      events.forEach(function(event, id) {
        let height = (event.end - event.start) / minutesInDay * containerHeight;
        let top = event.start / minutesInDay * containerHeight;
        let end = event.end;
        let start = event.start;
        let units = width[id];
        if (!units) {units = 1};
        let left = (containerWidth / width[id]) * (leftOffSet[id] - 1) + 10;
        if (!left || left < 0) {left = 10};
        renderEvent(height, top, left, units);
      });
    }
  }
  
  window.layOutDay = function(events) {
    let obj = new scheduledEvents(events);
    obj.render();
  }
  
  window.onload = function() {
    layOutDay([
      {start: 30, end: 150},
      {start: 540, end: 600},
      {start: 560, end: 620},
      {start: 610, end: 670}
    ])
  }

  