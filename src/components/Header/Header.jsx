import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ActionSearch from 'material-ui/svg-icons/action/search';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import ActionSettings from 'material-ui/svg-icons/action/settings';
import Bug from 'material-ui/svg-icons/action/bug-report';
import LogOutButton from 'material-ui/svg-icons/action/power-settings-new';
import styled from 'styled-components';
import LocalizationMenu from '../Localization';
import Dropdown from '../Header/Dropdown';
import constants from '../constants';
import AccountWidget from '../AccountWidget';
import SearchForm from '../Search/SearchForm';
import AppLogo from '../App/AppLogo';
import BurgerMenu from './BurgerMenu';
import { GITHUB_REPO } from '../../config';

const REPORT_BUG_PATH = `//github.com/${GITHUB_REPO}/issues`;

const VerticalAlignToolbar = styled(ToolbarGroup)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDropdown = styled(Dropdown)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VerticalAlignDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const TabContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BugLink = styled.a`
  font-size: ${constants.fontSizeMedium};
  font-weight: ${constants.fontWeightLight};
  color: ${constants.colorMutedLight} !important;
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-right: 15px;
  & svg {
    margin-right: 5px;
    /* Override material-ui */
    color: currentColor !important;
    width: 18px !important;
    height: 18px !important;
  }
`;

const ToolbarHeader = styled(Toolbar)`
  background-color: ${constants.defaultPrimaryColor} !important;
  padding: 8px !important;
  & a {
    color: ${constants.primaryTextColor};
    &:hover {
      color: ${constants.primaryTextColor};
      opacity: 0.6;
    }
  }
`;

class Header extends React.Component {
  static propTypes = {
    location: PropTypes.shape({}),
    small: PropTypes.bool,
    user: PropTypes.shape({}),
    strings: PropTypes.shape({}),
    navbarPages: PropTypes.arrayOf(PropTypes.shape({})),
    disableSearch: PropTypes.bool,
  };

  constructor() {
    super();
    this.state = {};
    import('../Announce').then(ann => this.setState({ Announce: ann.default }));
  }

  render() {
    const {
      location, small, user, strings, navbarPages, disableSearch,
    } = this.props;

    const burgerItems = [
      <AccountWidget key={0} />,
      ...navbarPages,
    ];

    const buttonProps = {
      children: <ActionSettings />,
    };

    const LogoGroup = ({ small }) => (
      <VerticalAlignToolbar>
        {!small && <BurgerMenu menuItems={burgerItems} />}
        <AppLogo style={{ marginRight: 18 }} />
      </VerticalAlignToolbar>
    );

    LogoGroup.propTypes = {
      small: PropTypes.bool,
    };

    const LinkGroup = () => (
      <VerticalAlignToolbar>
        {navbarPages.map(Page => (
          <TabContainer key={Page.key}>
            <div style={{ margin: '0 10px', textAlign: 'center', fontWeight: `${constants.fontWeightNormal} !important` }}>
              {Page}
            </div>
          </TabContainer>
      ))}
      </VerticalAlignToolbar>
    );

    const SearchGroup = () => (
      <VerticalAlignToolbar style={{ marginLeft: 20 }}>
        <ActionSearch style={{ marginRight: 6, opacity: '.6' }} />
        <SearchForm />
      </VerticalAlignToolbar>
    );

    const AccountGroup = () => (
      <VerticalAlignToolbar>
        <AccountWidget />
      </VerticalAlignToolbar>
    );

    const SettingsGroup = ({ user }) => (
      <VerticalAlignDropdown
        Button={IconButton}
        buttonProps={buttonProps}
      >
        <LocalizationMenu />
        <ReportBug />
        {user ? <LogOut /> : null}
      </VerticalAlignDropdown>
    );

    SettingsGroup.propTypes = {
      user: PropTypes.shape({}),
    };

    const ReportBug = () => (
      <BugLink
        href={REPORT_BUG_PATH}
        target="_blank"
        rel="noopener noreferrer"
      >
        <Bug />
        <span>
          {strings.app_report_bug}
        </span>
      </BugLink>
    );

    const LogOut = () => (
      <BugLink
        href={`${process.env.REACT_APP_API_HOST}/logout`}
        rel="noopener noreferrer"
      >
        <LogOutButton />
        <span>
          {strings.app_logout}
        </span>
      </BugLink>
    );

    const { Announce } = this.state;

    return (
      <div>
        <ToolbarHeader>
          <VerticalAlignDiv>
            <LogoGroup small={small} />
            {small && <LinkGroup />}
            {!disableSearch && <SearchGroup />}
          </VerticalAlignDiv>
          <VerticalAlignDiv style={{ marginLeft: 'auto' }}>
            {small && <AccountGroup />}
            {<SettingsGroup user={user} />}
          </VerticalAlignDiv>
        </ToolbarHeader>
        { location.pathname !== '/' && Announce && <Announce /> }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  small: state.browser.greaterThan.small,
  user: state.app.metadata.data.user,
  strings: state.app.strings,
});

export default connect(mapStateToProps, null)(Header);
