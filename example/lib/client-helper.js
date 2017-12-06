const element = {
  start: {
    onClick: function(callback) {
      document.getElementById('start').addEventListener('click', callback);
    },
    enable: function() {
      document.getElementById('start').disabled = false;
    },
    disable: function() {
      document.getElementById('start').disabled = true;
    }
  },
  status: {
    set: function(status) {
      document.getElementById('status').innerHTML = status;
    }
  },
  text: {
    set: function(text) {
      document.getElementById('text').innerHTML = text;
    }
  }
};
