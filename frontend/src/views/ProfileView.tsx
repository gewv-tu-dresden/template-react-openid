import React from "react";
import { Layout, PageHeader, Form, Input, Switch, Icon } from "antd";
import { useReactOidc } from "@axa-fr/react-oidc-context";

export default function ProfileView() {
  const { oidcUser } = useReactOidc();
  const formItemLayout = {
    labelCol: {
      xs: { span: 34 },
      sm: { span: 2 }
    },
    wrapperCol: {
      xs: { span: 4 },
      sm: { span: 6 }
    }
  };

  if (oidcUser == null) return <div />;

  return (
    <Layout.Content id="profile-content">
      <PageHeader
        style={{
          borderBottom: "1px solid rgb(235, 237, 240)"
        }}
        title="Your Profile"
        subTitle="Informations from you"
      />
      <Form {...formItemLayout}>
        <Form.Item label="Name">
          <Input value={oidcUser.profile.name} disabled />
        </Form.Item>
        <Form.Item label="Username">
          <Input value={oidcUser.profile.preferred_username} disabled />
        </Form.Item>
        <Form.Item label="E-mail">
          <Input value={oidcUser.profile.email} disabled />
        </Form.Item>
        <Form.Item label="E-mail verified">
          <Switch
            checkedChildren={<Icon type="check" />}
            unCheckedChildren={<Icon type="close" />}
            checked={oidcUser.profile.email_verified}
            disabled
            className="profile-email-check-switch"
          />
        </Form.Item>
      </Form>
    </Layout.Content>
  );
}
