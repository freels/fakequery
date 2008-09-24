function assert(arg, message) {
  if (!arg == true) {
    console.log("FAIL: " + message);
  }
}

function assert_equal(expected, actual) {
  assert(expected == actual, "expected " + expected + ", received " + actual);
}