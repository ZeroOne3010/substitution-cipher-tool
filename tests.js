module("JavaScript and HTML");

test("Pressing the Analyze button should show the correct substitution table and plaintext for 'aaaaaaaabbbbc'", 13,
    function() {
      equal($("div#substitution:visible").size(), 0, "Substitution table should not be visible initially");
      equal($("div#result:visible").size(), 0, "Plaintext should not be visible initially");
      $("textarea").val("aaaaaaaabbbbc")
      $("div#input input#analyze").click();
      equal($("div#substitution:visible").size(), 1, "Substitution table should be visible after the button is clicked");
      equal($("div#result:visible").size(), 1, "Plaintext should be visible after the button is clicked");
      var expectedSubstitutionTableContents = {
        'a' : 8,
        'b' : 4,
        'c' : 1
      };
      $.each(expectedSubstitutionTableContents, function(letter, amount) {
        $cipher = $("tr.cipher th:contains('" + letter + "')");
        equal($cipher.size(), 1, "'" + letter + "' should be within the cipher text letters in the substitution table");
        var $letterCount = $("tr.amount td." + $cipher.attr("class"));
        equal($letterCount.html(), amount, "Count of '" + letter + "' should be " + amount + ".");
        var $plaintext = $("tr.plaintext input." + $cipher.attr("class"));
        equal($plaintext.val(), letter, "There should be a plaintext input box for '" + letter + "'");
      });
    });

module("Just plain JavaScript");

test("Character frequency calculation", 2, function() {
  var expected = {
    'A' : 2,
    'B' : 1,
    'F' : 1,
    'O' : 3,
    'R' : 1
  };
  var actual = calculateCharacterFrequencies("FOOOBAAR".split(""));
  deepEqual(actual, expected, 'FOOOBAAR test');

  var expected = {
    ' ' : 2,
    'e' : 3,
    'h' : 1,
    'n' : 1,
    'o' : 2,
    'r' : 1,
    't' : 2,
    'w' : 1,
  };
  var actual = calculateCharacterFrequencies("one two three".split(""));
  deepEqual(actual, expected, 'one two three test');
});

test("isWhitespace should return true", 4, function() {
  ok(isWhitespace(" "), 'space');
  ok(isWhitespace("\n"), 'line feed');
  ok(isWhitespace("\r"), 'carriage return');
  ok(isWhitespace("\t"), 'tab');
});

test("isWhitespace should return false", 4, function() {
  ok(!isWhitespace(" asd "), "space padded string");
  ok(!isWhitespace("foobar"), "foobar");
  ok(!isWhitespace("x"), 'x');
  ok(!isWhitespace("A"), 'A');
});
