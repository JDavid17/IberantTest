﻿import * as React from 'react'
import { Form, Spin, Select, Input, Checkbox, Modal, Row, Col, Alert, InputNumber, Table } from 'antd';
import { FormComponentProps } from 'antd/lib/form';
let FormItem = Form.Item;
import { NewUser, NewUserStore } from 'src/stores/user-store';
import { connect } from 'redux-scaffolding-ts'
import { nameof } from 'src/utils/object';
import autobind from 'autobind-decorator';
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form';
import { formatMessage } from 'src/services/http-service';


interface NewUserViewProps {
    onClose: (id: string | undefined, item?: NewUser) => void;
}

interface NewUserViewState {

}

interface ClassFormBodyProps {
    item: NewUser | undefined,
    onSave?: () => Promise<any>;
    setFieldsValue(obj: Object): void;
    getFieldValue(fieldName: string): any;
    getFieldDecorator<T extends Object = {}>(id: keyof T, options?: GetFieldDecoratorOptions): (node: React.ReactNode) => React.ReactNode;
}

export class TestItemFormBody extends React.Component<ClassFormBodyProps> {
    render() {
        const { getFieldDecorator } = this.props;

        var item = this.props.item || {} as NewUser;
        return <Form id="modaForm" onSubmit={() => { if (this.props.onSave) { this.props.onSave(); } }}>
            <Row gutter={24}>
                <Col span={12}>
                    <FormItem label={"Name"}>
                        {getFieldDecorator(nameof<NewUser>('name'), {
                            initialValue: item.name,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>

                <Col span={12}>
                    <FormItem label={'LastName'}>
                        {getFieldDecorator(nameof<NewUser>('lastName'), {
                            initialValue: item.lastName,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>

                <Col span={12}>
                    <FormItem label={'Address'}>
                        {getFieldDecorator(nameof<NewUser>('address'), {
                            initialValue: item.address,
                        })(
                            <Input />
                        )}
                    </FormItem>
                </Col>
            </Row>
        </Form>
    }
}

@connect(["newUser", NewUserStore])
class NewUserView extends React.Component<NewUserViewProps & FormComponentProps, NewUserViewState> {
    private get UsersStore() {
        return (this.props as any).newUser as NewUserStore;
    }

    constructor(props: NewUserViewProps & FormComponentProps) {
        super(props);
        this.UsersStore.createNew({} as any);
    }

    componentWillReceiveProps(nextProps: NewUserViewProps) {
        if (this.UsersStore.state.result && this.UsersStore.state.result.isSuccess)
            nextProps.onClose((this.UsersStore.state.result as any).aggregateRootId, this.UsersStore.state.item)
    }

    @autobind
    private onCreateNewItem() {
        var self = this;
        return new Promise((resolve, reject) => {
            self.props.form.validateFields(event => {
                var values = self.props.form.getFieldsValue();
                if (!event) {
                    values = { ...values, };
                    self.UsersStore.change(values);
                    self.UsersStore.submit().then(result => {
                        if (result.isSuccess) {
                            resolve();
                        } else {
                            reject();
                        }
                    });
                }
            });
        })
    }

    @autobind
    private onCancelNewItem() {
        this.UsersStore.clear();
        this.props.onClose(undefined);
    }

    public render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Modal
                maskClosable={false}
                visible
                onCancel={this.onCancelNewItem}
                onOk={this.onCreateNewItem}
                closable={false}
                width='800px'
                title={"New TestItem"}>
                {this.UsersStore.state.result && !this.UsersStore.state.result.isSuccess &&
                    <Alert type='error'
                        message="Ha ocurrido un error"
                        description={formatMessage(this.UsersStore.state.result)}
                    />
                }
                <Spin spinning={this.UsersStore.state.isBusy}>
                    <TestItemFormBody item={this.UsersStore.state.item} getFieldDecorator={getFieldDecorator} getFieldValue={this.props.form.getFieldValue} setFieldsValue={this.props.form.setFieldsValue} onSave={this.onCreateNewItem} />
                </Spin>
            </Modal>
        );
    }
}

// Wire up the React component to the Redux store
export default Form.create({})(NewUserView as any) as any as React.ComponentClass<NewUserViewProps>;