var foo = false;
var bar = true;
function setState(state) {
  console.log(state.foo);
  console.log(state.bar);
}
setState({foo, bar})
