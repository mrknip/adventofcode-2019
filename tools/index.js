console.log('Script started');


var currentInputValue;
var outputDiv = document.getElementById('output-view');
var input = document.getElementById('input');


function clearElement (element) {
  while(element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

function copyToClipboard(string) {
  const el = document.createElement('textarea');
  el.value = string;
  el.setAttribute('readonly', '');
  el.style.position = 'absolute';
  el.style.left = '-9999px';
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);

}

function renderOutput(input) {
  console.log(input)
  const instructions = []
  try {
    const program = new IntcodeProgram(input.trim().split(',').map(v => +v), {
      forEachInstruction: ((program = {}) => {
        instructions.push(program.memory);
      })
    });

    program.run();
  }  catch (e) {
    console.error(e);
  }

  console.log({instructions})
  var rows = input.split('\n');

  container = document.createElement('div');
  container.className = 'shape--container';

  instructions.forEach((instruction) => {
    const instructionDiv = document.createElement('div');

    const nameSpan = document.createElement('span');
    nameSpan.innerText = instruction.name;

    instructionDiv.appendChild(nameSpan);

    container.appendChild(instructionDiv);
  });
  // rows.forEach((row) => {
  //   var rowEl = document.createElement('div');
  //   rowEl.className = 'shape--row';
  //
  //   var cells = row.split('');
  //
  //   cells.forEach((cell) => {
  //     const cellEl = document.createElement('div');
  //     cellEl.className = `shape--cell shape--cell__${cell}`;
  //
  //     rowEl.appendChild(cellEl);
  //   });

    // shapeContainer.appendChild(rowEl);
  // });

  return container;
}

function tick() {
  if (input.value !== currentInputValue) {
    clearElement(outputDiv);
    const output = renderOutput(input.value);
    outputDiv.appendChild(output);
    currentInputValue = input.value;
  }

  requestAnimationFrame(tick);
}

requestAnimationFrame(tick);
