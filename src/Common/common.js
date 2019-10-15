import React, { Component } from 'react';
import './common.css';
import {HashRouter as Router,Route,Link} from 'react-router-dom';
import {Layout, Dropdown, Icon, Menu, Col, Modal, Form, Input, Button} from 'antd'
import { createHashHistory } from 'history'; 
import 'antd/dist/antd.css'
import Mgr from '../Manager/mgr'
import Log from '../Log/log'

const {Header, Content} = Layout
const {confirm} = Modal

class Common extends Component {
    constructor(props) {
        super(props);
        this.state = { movisiable: false ,confirmsignal:false};
    }
    modifypwd = () => {
        this.setState({
            movisiable: true
        })
    }
    outlogin = () => {
        let history = createHashHistory();
        confirm({
            title:'确认退出？',
            onOk(){
                history.push('/')
            },
            onCancel(){}
        })
    }
    mosub = e => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
            if(!err){
                console.log(values)
            }
        })
    }
    handleCancel = () => {
        this.setState({
            movisiable:false
        })
        this.props.form.resetFields()
    }
    checkpwd = (rule,value,callback) => {
        const {form} = this.props
        if(value && this.state.confirmsignal){
            form.validateFields(['confirm'],{force:true})
        }
        callback()
    }
    checkconfirm = (rule,value,callback) => {
        const {form} = this.props
        if(value && value !== form.getFieldValue('newpwd')){
            callback('两次输入密码不匹配')
        }
        else{
            callback()
        }
    }
    handleConfirm = e =>{
        const {value} = e.target
        this.setState({
            confirmsignal:this.state.confirmsignal || !!value
        })
    }
    formreset = () =>{
        this.props.form.resetFields()
    }
    render() {
        const menu= (
            <Menu>
                <Menu.Item onClick={this.modifypwd}>修改密码</Menu.Item>
                <Menu.Item onClick={this.outlogin}>退出</Menu.Item>
            </Menu>
        )
        const ItemLayout = {
            labelCol : {
                xs:{span:24},
                sm:{span:6}
            },
            wrapperCol: {
                xs:{span:24},
                sm:{span:16}
            }
        }
        const newLayouot = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              sm: {
                span: 8,
                offset: 15,
              },
            },
          }
        const { getFieldDecorator } = this.props.form;
        return (
            <Router>
            <Layout>
                <Header>
                    <Col span={8}>
                        <Link to='/Mgr'>
                            <img src={require('../static/logo_ZXGL.png')} alt='' className='imgs'></img>
                            <img src={require('../static/character01-zxglpt.png')} alt='' ></img>
                        </Link>
                    </Col>
                    <Col span={3} offset={13}>
                        <Link to='/Log'>
                            <Icon type="profile" className='icon'/>
                            <span className='inline log'>日志</span>
                        </Link>
                        <div className='inline'>
                            <Icon type="user" className='icon' />
                            <Dropdown overlay={menu}>
                                <span style={{cursor:'pointer'}}>
                                    admin<Icon type='down' />
                                </span>
                            </Dropdown>
                        </div>
                    </Col>
                    </Header>
                    <Content style={{backgroundColor:'#151A37',height:'100%'}}>
                        <Route exact path='/Mgr' component={Mgr}/>
                        <Route exact path='/Log' component={Log}/>
                    </Content>
                    <Modal title='修改密码' visible={this.state.movisiable} onCancel={this.handleCancel} footer={null}>
                        <Form {...ItemLayout} onSubmit={this.mosub}>
                            <Form.Item label='原密码' hasFeedback>
                                {getFieldDecorator('oldpwd',{
                                    rules:[
                                        {required:true,message:'请输入您的密码',whitespace:true}
                                    ]
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label='新密码' hasFeedback>
                                {getFieldDecorator('newpwd',{
                                    rules:[
                                        {required:true,message:'请输入您的新密码',whitespace:true},
                                        {validator:this.checkpwd}
                                    ]
                                })(<Input.Password />)}
                            </Form.Item>
                            <Form.Item label='确认密码' hasFeedback>
                                {getFieldDecorator('confirmpwd',{
                                    rules:[
                                        {required:true,message:'请再次输入您的新密码',whitespace:true},
                                        {validator:this.checkconfirm}
                                    ]
                                })(<Input.Password onBlur={this.handleConfirm} />)}
                            </Form.Item>
                            <Form.Item {...newLayouot}>
                                <Button onClick={this.formreset}>重置</Button>
                                <Button type='primary' htmlType='submit' className='btn'>确定</Button>
                            </Form.Item>
                        </Form>
                    </Modal>
                </Layout>
            </Router>
        );
    }
}
const Formcom = Form.create({name:'commonform'})(Common)
export default Formcom;