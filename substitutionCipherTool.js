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

function shouldDiscardKeyEvent(event) {
  return event.which < 32;
}

function registerChangeHandlers() {
  $('tr.plaintext input').keyup(function(event) {
    if (shouldDiscardKeyEvent(event)) {
      return;
    }
    updatePlaintextByInput(this);
    scanAndAlertForDuplicateLetterAssignments();
  });
  $('tr.plaintext input').keydown(function(event) {
    if (shouldDiscardKeyEvent(event)) {
      return;
    }
    if ($(this).val() != "") {
      $(this).val("");
    }
  });
  $('tr.plaintext input').click(function(event) {
    var classNames = $(this).attr("class");
    var classesArray = classNames.split(" ");
    var className = "";
    $.each(classesArray, function(index, classItem) {
      if (classItem.indexOf('c') == 0) {
        className = classItem;
      }
    });
    highlightPlaintextByClass(className);
  });
  $('div#result span').click(function() {
    var className = $(this).attr("class");
    var input = "div#substitution .plaintext input." + className;
    $(input).focus();
    $(input).effect("highlight", {
      color : "#FFFF00"
    }, 500);
    highlightPlaintextByClass(className);
  });
}

function highlightPlaintextByClass(letterClass) {
  var plaintext = "span." + letterClass;
  $(plaintext).effect("highlight", {
    color : "#FFFF00"
  }, 500);
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
  $('div#resultContainer').show();
  registerChangeHandlers();
}

function guessFinnish() {
  guess(finnishLettersByFrequency.split(""));
}

function guessEnglish() {
  guess(englishLettersByFrequency.split(""));
}

function guess(letters) {
  $.fx.off = true;
  var $amounts = $("tr.amount td");
  var cipherTextLetterAmounts = [];
  $.each($amounts, function(index) {
    var amount = parseFloat($(this).text());
    amount = addVariation(amount);
    var entry = {
      "class" : $(this).attr("class"),
      "amount" : amount,
    };
    cipherTextLetterAmounts.push(entry);
  });
  cipherTextLetterAmounts.sort(function(a, b) {
    return b.amount - a.amount;
  });
  $.each(cipherTextLetterAmounts, function(index, value) {
    var inputLocator = "input." + value.class;
    $(inputLocator).val(letters[index]);
    updatePlaintextByInput(inputLocator);
  });
  scanAndAlertForDuplicateLetterAssignments();
  $.fx.off = false;
}

function addVariation(number) {
  var VARIATION = 0.05;
  var randomAmount = 2 * VARIATION * number;
  number = (number - VARIATION) * number + (Math.random() * randomAmount);
  return number;
}

function scanAndAlertForDuplicateLetterAssignments() {
  var usedLetters = {};
  var $inputs = $('#substitution .plaintext input');
  $.each($inputs, function(index) {
    $(this).parent().removeClass('duplicate');
  });
  $.each($inputs, function(index) {
    var letter = $(this).val();
    if (usedLetters[letter] == undefined) {
      usedLetters[letter] = 1;
    } else {
      $.each($inputs, function() {
        if ($(this).val() == letter) {
          $(this).parent().addClass('duplicate');
        }
      });
    }
  });
}

function rotButton() {
  var text = $('textarea').val();
  $('div#rotDialog').html("");
  for ( var i = 1; i <= 25; i++) {
    var result = "<div class='rot'>ROT" + i + " <span class='minus'>(-" + (26 - i) + ")</span>: ";
    result += "<span class='rotResult rot" + i + "'>" + rot(i, text) + "</span></div>";
    $('div#rotDialog').append(result);
  }
  $('div#rotDialog').dialog({
    minWidth : 380
  });
}

function rot(n, text) {
  var A = 65;
  var Z = 90;
  var a = 97;
  var z = 122;
  var result = "";
  for ( var i = 0; i < text.length; i++) {
    var letter = text.substr(i, 1);
    letter = shift(n, letter, a, z);
    letter = shift(n, letter, A, Z);
    console.log(text.substr(i, 1) + " -> " + letter);
    result += letter;
  }
  return result;
}

function shift(n, letter, min, max) {
  var charCode = letter.charCodeAt(0);
  if (charCode >= min && charCode <= max) {
    var newCharCode = charCode + n;
    if (newCharCode > max) {
      newCharCode = min + (newCharCode % (max + 1));
    }
    letter = String.fromCharCode(newCharCode);
  }
  return letter;
}

function init() {
  $('input#analyze').click(analyze);
  $('input#rotn').click(rotButton);
  $('input#guessFinnish').click(guessFinnish);
  $('input#guessEnglish').click(guessEnglish);
  $('div#resultContainer').width($('div#input textarea').width());
}

$(document).ready(function() {
  init();
});