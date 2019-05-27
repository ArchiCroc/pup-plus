import Uniforms from 'uniforms';
import SimpleSchema from 'simpl-schema';
import i18n from 'meteor/universe:i18n';
import isString from 'lodash/isString';

const ProfileSchema = new SimpleSchema({
  _id: {
    type: String,
    max: 50,
    optional: true,
    uniforms: {
      type: 'hidden',
    },
  },
  firstName: {
    type: String,
    label: () => i18n.__('first_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('first_name'),
    },
  },
  lastName: {
    type: String,
    label: () => i18n.__('last_name'),
    max: 100,
    uniforms: {
      placeholder: () => i18n.__('last_name'),
    },
  },
  emailAddress: {
    type: String,
    label: () => i18n.__('email_address'),
    max: 200,
    regEx: SimpleSchema.RegEx.Email,
    autoValue() {
      if (this.value && isString(this.value)) {
        return this.value.toLowerCase();
      }
      return this.value;
    },
    uniforms: {
      placeholder: () => i18n.__('email_address'),
      type: 'email',
    },
  },
  currentPassword: {
    type: String,
    label: () => i18n.__('current_password'),
    optional: true,
    min: 8,
    max: 100,
    uniforms: {
      type: 'password',
    },
    custom() {
      if (this.value && !this.field('newPassword').value) {
        console.log('Add error to new password');
        this.addValidationErrors([
          // @todo weird bug that type isn't being converted to the correct error message
          {
            name: 'newPassword',
            type: 'missingNewPassword',
            message: 'Need your new password if changing.',
          },
        ]);
        return false;
      }
      return null;
    },
  },
  newPassword: {
    type: String,
    label: () => i18n.__('new_password'),
    optional: true,
    uniforms: {
      type: 'password',
    },
    custom() {
      // console.log('new', this.field('currentPassword').value);
      if (this.value && !this.field('currentPassword').value) {
        console.log('Add error to current password');
        this.addValidationErrors([
          {
            name: 'currentPassword',
            type: 'missingCurrentPassword',
            message: 'Need your current password if changing.',
          },
        ]);
        return false;
      }
      return null;
    },
  },
});

// var password_match_error = TAPi18n.__('password_match_error');
// SignupSchema.messages({
SimpleSchema.setDefaultMessages({
  messages: {
    en: {
      alreadyRegistered: 'Email Address Already Exists',
      missingNewPassword: 'Need your new password if changing.',
      missingCurrentPassword: 'Need your current password if changing.',
    },
  },
  //  noMatch: "Password Doesn't Match",
});

export default ProfileSchema;