import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';
import Icon from 'antd/lib/icon';
import StyledLogout from './StyledLogout';

const { productName, twitterUsername, facebookUsername } = Meteor.settings.public;

function Logout(props) {
  useEffect(() => {
    Meteor.logout(() => props.setAfterLoginPath(null));
  });

  return (
    <StyledLogout>
      <img
        src="https://s3-us-west-2.amazonaws.com/cleverbeagle-assets/graphics/email-icon.png"
        alt="Clever Beagle"
      />
      <h1>Stay safe out there.</h1>
      <p>{`Don't forget to like and follow ${productName} elsewhere on the web:`}</p>
      <ul className="FollowUsElsewhere">
        <li>
          <a
            href={`https://facebook.com/${facebookUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon type="facebook" />
          </a>
        </li>
        <li>
          <a
            href={`https://twitter.com/${twitterUsername}?utm_source=app&utm_medium=referral&utm_campaign=logoutPage`}
          >
            <Icon type="twitter" />
          </a>
        </li>
      </ul>
    </StyledLogout>
  );
}

Logout.propTypes = {
  setAfterLoginPath: PropTypes.func.isRequired,
};

export default Logout;
