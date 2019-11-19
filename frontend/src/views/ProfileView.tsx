import React, { useContext, useEffect } from "react";
import { Layout, PageHeader, Form, Input, Switch, Icon, Card } from "antd";
import { UserContext } from "../App";

export default function ProfileView() {
  const { user, loadUser } = useContext(UserContext);
  useEffect(() => {
    loadUser();
  }, []);
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

  if (user == null) return <div />;
  console.log(user);

  return (
    <Layout.Content id="profile-content">
      <Card title="Your Profile" id="profile-card">
        <Form {...formItemLayout}>
          <Form.Item label="Name">
            <Input value={user.name} disabled />
          </Form.Item>
          <Form.Item label="Username">
            <Input value={user.preferred_username} disabled />
          </Form.Item>
          <Form.Item label="E-mail">
            <Input value={user.email} disabled />
          </Form.Item>
          <Form.Item label="Verified">
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
              checked={user.email_verified}
              disabled
              className="profile-email-check-switch"
            />
          </Form.Item>
        </Form>
      </Card>
    </Layout.Content>
  );
}
