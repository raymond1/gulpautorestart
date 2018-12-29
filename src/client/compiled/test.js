'use strict';
const title = 'Test title 3';
const e = <h1>{title}</h1>;

ReactDOM.render(e,document.getElementById('test'));
/*
class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false };
  }

  render() {
    if (this.state.liked) {
      return 'You liked this.';
    }

    return e(
      'button',
      { onClick: () => this.setState({ liked: true }) },
      'Like'
    );
  }
}
*/
console.log('test');