test("Character frequency calculation", function() {
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

test("isWhitespace should return true", function() {
    ok(isWhitespace(" "), 'space');
    ok(isWhitespace("\n"), 'line feed');
    ok(isWhitespace("\r"), 'carriage return');
    ok(isWhitespace("\t"), 'tab');
});

test("isWhitespace should return false", function() {
  ok(!isWhitespace(" asd "), "space padded string");
  ok(!isWhitespace("foobar"), "foobar");
  ok(!isWhitespace("x"), 'x');
  ok(!isWhitespace("A"), 'A');
});
