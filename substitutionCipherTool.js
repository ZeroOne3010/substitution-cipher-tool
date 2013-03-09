var BACKSPACE = 8;
var TAB = 9;
var CR = 13;

var finnishLettersByFrequency = "aitneslokuämvrjhypdögbfcwåqzx"; // http://www.cs.tut.fi/~jkorpela/kielikello/kirjtil.html
var englishLettersByFrequency = "etaoinshrdlcumwfgypbvkjxqz"; // http://en.wikipedia.org/wiki/Letter_frequency

// Each cipher text symbol is assigned an unique number,
// to be used in CSS classes. These two variables are for that:
var characterIndexMap = {};
var charNumber = 0;

function calculateCharacterFrequencies(textArray) {
  var sorted = textArray.slice(0).sort();
  var frequencyMap = {};
  for (i = 0; i < sorted.length; i++) {
    if (!frequencyMap[sorted[i]]) {
      frequencyMap[sorted[i]] = 0;
      characterIndexMap[sorted[i]] = charNumber++;
    }
    frequencyMap[sorted[i]]++;
  }
  return frequencyMap;
}

function createSubstitutionTable(textArray) {
  var frequencyMap = calculateCharacterFrequencies(textArray);
  var cipherCharacterRow = $("<tr class='cipher'><th>Cipher</th></tr>");
  var amountRow = $("<tr class='amount'><th>Amount</th></tr>");
  var inputRow = $("<tr class='plaintext'><th>Plaintext</th></tr>");
  console.clear();
  $.each(frequencyMap, function(symbol, amount) {
    if (!isWhitespace(symbol)) {
      console.log(symbol + ": " + amount);
      var cipherCharacterCell = $("<th>" + symbol + "</th>");
      var amountCell = $("<td>" + amount + "</td>");
      cipherCharacterCell.addClass(getClassForCharacter(symbol));
      cipherCharacterRow.append(cipherCharacterCell);
      amountCell.addClass(getClassForCharacter(symbol));
      amountRow.append(amountCell);
      inputRow.append(getInputCellForSymbol(symbol));
    }
  });
  $('div#substitution table').empty();
  $('div#substitution table').append(cipherCharacterRow);
  $('div#substitution table').append(amountRow);
  $('div#substitution table').append(inputRow);
}

function isWhitespace(symbol) {
  return symbol == "\n" || symbol == "\r" || symbol == " " || symbol == "\t";
}

function getInputCellForSymbol(symbol) {
  var className = getClassForCharacter(symbol);
  var inputCell = $("<td></td>");
  var input = $("<input type='text' maxlength='1'/>");
  inputCell.addClass(className);
  input.addClass(className);
  input.val(symbol);
  inputCell.append(input);
  return inputCell;
}

function getClassForCharacter(symbol) {
  return "c" + characterIndexMap[symbol];
}

function createResultElements(textArray) {
  $('div#result').empty();
  $.each(textArray, function(index, symbol) {
    if (symbol == "\n") {
      symbol = "<br/>";
    }
    var plainTextCharElement = $("<span>" + symbol + "</span>");
    $(plainTextCharElement).addClass("c" + characterIndexMap[symbol]);
    $('div#result').append(plainTextCharElement);
  });
}

function registerChangeHandlers() {
  $('tr.plaintext input').keyup(function(event) {
    if (event.which == CR || event.which == BACKSPACE || event.which == TAB) {
      return;
    }
    updatePlaintextByInput(this);
  });
  $('tr.plaintext input').keydown(function(event) {
    if (event.which == CR || event.which == BACKSPACE || event.which == TAB) {
      return;
    }
    if ($(this).val() != "") {
      $(this).val("");
    }
  });
  $('div#result span').click(function() {
    var className = $(this).attr("class");
    var input = "div#substitution .plaintext input." + className;
    var plaintext = "span." + className;
    $(input).focus();
    $(input).effect("highlight", {
      color : "#FFFF00"
    }, 500);
    $(plaintext).effect("highlight", {
      color : "#FFFF00"
    }, 500);
  });
}

function updatePlaintextByInput(element) {
  var newValue = $(element).val();
  var className = $(element).attr('class');
  var locator = "span." + className;
  $(locator).text(newValue);
  $(locator).effect("highlight", {
    color : "#00FF00"
  }, 750);
}

function analyze() {
  var textArray = $('textarea').val().split("");
  createSubstitutionTable(textArray);
  createResultElements(textArray);
  $('div#substitution').show();
  $('div#result').show();
  registerChangeHandlers();
}

function guessFinnish() {
  guess(finnishLettersByFrequency.split(""));
}

function guessEnglish() {
  guess(englishLettersByFrequency.split(""));
}

function guess(letters) {
  var $amounts = $("tr.amount td");
  var array = [];
  $.each($amounts, function(index) {
    var entry = {
      "class" : $(this).attr("class"),
      "amount" : $(this).text()
    };
    array.push(entry);
  });
  array.sort(function(a, b) {
    return b.amount - a.amount;
  });
  $.each(array, function(index, value) {
    var inputLocator = "input." + value.class;
    $(inputLocator).val(letters[index]);
    updatePlaintextByInput(inputLocator);
  });
}

$(document).ready(function() {
  $('input#analyze').click(analyze);
  $('input#guessFinnish').click(guessFinnish);
  $('input#guessEnglish').click(guessEnglish);
});