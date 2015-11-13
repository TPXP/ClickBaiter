var button = document.getElementById('save');

var saveData = function () {
  var action = $('input[name="action"]:checked').val();

  //Emit event listener
  self.port.emit('saved', action);
  button.innerHTML = 'Saved!';

  setTimeout(function () {
    button.innerHTML = 'Save';
  }, 1000);

}

button.addEventListener('click', saveData);