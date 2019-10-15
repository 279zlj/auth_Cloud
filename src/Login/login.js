import React, { Component } from 'react';
import './login.css'
import {Form, Button, Layout, Col, Icon, Input} from 'antd'
import 'antd/dist/antd.css'

const {Header, Content, Footer} = Layout

class login extends Component {
    constructor(props) {
        super(props);
        this.state = {  };
    }
    loginsub = e => {
        e.preventDefault();
        let history = this.props.history
        this.props.form.validateFieldsAndScroll((err,val)=>{
            if(!err){
                history.push('/Mgr')
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return (
            <Layout>
                <Header>
                    <img src={require('../static/logo_ZXGL.png')} alt='' className='imgs' />
                    <img src={require('../static/character01-zxglpt.png')} alt=''  />
                </Header>
                <Content className='lcontent'>
                    <Col span={12} className='bgparent'>
                        <img src={require('../static/bg01.png')} className='bgimg'  alt='' />
                    </Col>
                    <Col span={6} offset={3} className='from'>
                        <div className='inner'>
                            <h2 className='welcome'>欢迎登录</h2>
                            <Form onSubmit={this.loginsub}>
                                <Form.Item label='' hasFeedback>
                                    {getFieldDecorator('username',{
                                        rules:[{required:true,message:'请输入账号',whitespace:true}]
                                    })(<Input prefix={<Icon type='user' />} />)}
                                </Form.Item>
                                <Form.Item label='' hasFeedback>
                                    {getFieldDecorator('pwd',{
                                        rules:[{required:true,message:'请输入密码',whitespace:true}]
                                    })(<Input  prefix={<Icon type='user' />}/>)}
                                </Form.Item>
                                <Form.Item>
                                    <Button type='primary' htmlType='submit' style={{width:'100%'}}>登录</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Content>
                <Footer style={{backgroundColor:'#191935'}}>
                    <div style={{position:'relative',textAlign:'center'}}>
                    <span className='footerfont'>浏览器推荐使用：谷歌(Chrome)、火狐(Firefox)、360(极速模式)、Microsoft Edge、IE10(以上)，大于1440*900分辨率!</span>
                            <span className='footerfont'>Copyright ® 2019 广州五舟科技股份有限公司. All rgihts reserved</span>
                    </div>
                </Footer>
            </Layout>
        );
    }
}
const Loginform = Form.create({name:'loginfrom'})(login)
export default Loginform;