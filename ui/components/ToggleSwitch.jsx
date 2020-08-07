import React from 'react';
import PropTypes from 'prop-types';
import CheckIcon from '@ant-design/icons/CheckOutlined';
import RemoveIcon from '@ant-design/icons/RemoveOutlined';

import Styles from './styles';

class ToggleSwitch extends React.Component {
  constructor(props) {
    super(props);
    const { toggled } = props;
    this.state = { toggled };
    console.log('toggle switch needs to updated');
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ toggled: nextProps.toggled });
  }

  toggleSwitch = (event) => {
    const { id, onToggle } = this.props;
    event.stopPropagation();
    this.setState(
      ({ toggled }) => ({
        toggled: !toggled,
      }),
      () => {
        const { toggled } = this.state;
        if (onToggle) onToggle(id, toggled);
      },
    );
  };

  render() {
    const { onLabel, offLabel } = this.props;
    const { toggled } = this.state;
    return (
      <Styles.ToggleSwitch className="ToggleSwitch" toggled={toggled} onClick={this.toggleSwitch}>
        <div className="handle">
          <span className="handle-label">
            {toggled ? onLabel || <CheckIcon /> : offLabel || <RemoveIcon />}
          </span>
        </div>
      </Styles.ToggleSwitch>
    );
  }
}

ToggleSwitch.propTypes = {
  id: PropTypes.string,
  toggled: PropTypes.bool,
  onLabel: PropTypes.string,
  offLabel: PropTypes.string,
  onToggle: PropTypes.func,
};

ToggleSwitch.defaultProps = {
  id: '',
  toggled: false,
  onLabel: '',
  offLabel: '',
  onToggle: () => {},
};

export default ToggleSwitch;
