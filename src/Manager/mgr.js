import React, { Component } from 'react';
import './mgr.css'
import {Button, Card, Input, Table, Icon, Tooltip, Modal, Form, notification, Tag} from 'antd'
import 'antd/dist/antd.css'
import Highlighter from 'react-highlight-words'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
// import axios from 'axios'

const {confirm}  = Modal

// var socket = ''
let socket = null;
let stompClient = null;

class mgr extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            searchText:'',
            modifyvisi:false,
            devices:[],
            rowdata:[],
            devicecol:[
                {title:'设备ID', dataIndex:'id', key:'id', width:'30%',...this.getColumnSearchProps('id')},
                {title:'部门ID', dataIndex:'deparment', key:'deparment'},
                {title:'在线状态', dataIndex:'state', key:'state', render: state => {
                    if(state === 'up'){
                        return(
                            <Tag color='green'>在线</Tag>
                        )
                    }
                    else if(state === 'down'){
                        return(
                            <Tag color='red'>离线</Tag>
                        )
                    }
                }
                },
                {title:'激活状态', dataIndex:'status', key:'status', render: status => {
                    if(status === 'active'){
                        return(
                            <Tag color='green'>已激活</Tag>
                        )
                    }
                    else if(status === 'inactive'){
                        return(
                            <Tag color='red'>未激活</Tag>
                        )
                    }
                }
                }
            ],
            devicedata:[
                {key:'1',id:'121321eawsdasdd',deparment:'8231',state:'down',status:'active'},
                {key:'2',id:'121321eawsdasdd',deparment:'8231',state:'up',status:'active'},
                {key:'3',id:'121321eawsdasdd',deparment:'8231',state:'down',status:'inactive'}
            ],
         };
    }
    
    componentDidMount(){
        // socket = require('socket.io-client')('http://192.168.2.236:8080/regDev')
        // socket.on('ok',(data)=>{
        //     console.log(data)
        // })
        socket = new SockJS('http://192.168.2.236:8080/regDev?name=wuxiaobin')
        stompClient = Stomp.over(socket)
        stompClient.connect({},function (res) {
            console.log(res)
            var data = {user:'123',status:0}
            
            // stompClient.send('/app/hello',{},JSON.stringify(data))
            stompClient.subscribe('/user/wuxiaobin/queue' ,data=>{
                console.log(data.body)
            })
            stompClient.send('/app/regDev',{},JSON.stringify(data))
            // stompClient.subscribe('/user/oooo/regDev',data=>{
            //     console.log(data.body)
            // })
        })
    }
    componentWillUnmount(){
        // socket.close()
        stompClient.disconnect(function(){
            console.log('disabled')
        })
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys,selectedKeys,confirm,clearFilters}) => (
            <div style={{ padding: 8 }}>
                <Input
                ref={node => {
                    this.searchInput = node;
                }}
                placeholder={`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                style={{ width: 188, marginBottom: 8, display: 'block'}}
                className='inpcolor'
                />
                <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm)}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
                >
                Search
                </Button>
                <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }} >
                <span className='inpcolor'>Reset</span>
                </Button>
            </div>
        ),
        filterIcon: filtered => (
            <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
        ),
        onFilter: (value, record) =>
        record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase()),
        onFilterDropdownVisibleChange: visible => {
        if (visible) {
            setTimeout(() => this.searchInput.select());
        }
        },
        render: text => (
        <Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
        />
        ),
    });
    handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
    };

    handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
    };
    rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                devices:selectedRowKeys,
                rowdata:selectedRows
            })
            console.log(this.state.rowdata)
        },
        getCheckboxProps: record => ({
            disabled: record.device === 'Disabled Divece',
            device: record.device
    
        })
    }
    activation = () =>{
        if(this.state.devices.length === 1){
            confirm({
                title:`激活当前设备：${this.state.devices}`,
                content:'激活后设备可用',
                okText:'确定',
                okType:'primary',
                cancelText:'取消',
                onOk(){},
                onCancel(){}
            })
        }
        else
            notification['error']({
                message:'请选择一个设备进行激活'
            })
    }
    logout = () =>{
        if(this.state.devices.length === 1){
            confirm({
                title:`注销当前设备：${this.state.devices}`,
                content:'注销后设备不可用',
                okText:'确定',
                okType:'danger',
                cancelText:'取消',
                onOk(){},
                onCancel(){}
            })
        }
        else
            notification['error']({
                message:'请选择一个设备注销'
            })
    }
    modifyid = () =>{
        if(this.state.devices.length === 1){
            this.setState({
                modifyvisi: true
            })
        }
        else
            notification['error']({
                message:'请选择一个设备进行修改'
            })
    }
    handleCancel = () => {
        this.setState({
            modifyvisi: false
        })
        this.props.form.resetFields()
    }
    formreset = () =>{
        this.props.form.resetFields()
    }
    idsub = e =>{
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err,values)=>{
            if(!err){
                console.log('asd',values)
            }
        })
    }
    render() {

        const ItemLayout={
            labelCol:{
                xs:{span:24},
                sm:{span:6}
            },
            wrapperCol:{
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
          };
          
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{margin:'1rem'}}>
                <Card size='small' title='设备管理' bordered={false} style={{backgroundColor:'#1B2143'}}>
                    <Tooltip placement='bottom' title='激活'>
                        <Button type='primary' className='btn' onClick={this.activation}  ><Icon type='bulb' theme='filled' /></Button>
                    </Tooltip>
                    <Tooltip placement='bottom' title='修改'>
                        <Button type='primary' className='btn' onClick={this.modifyid}  ><Icon type='edit' theme='filled' /></Button>
                    </Tooltip>
                    <Tooltip placement='bottom' title='注销'>
                        <Button type='danger' className='btn' onClick={this.logout}  ><Icon type="poweroff" /></Button>
                    </Tooltip>
                    <Table columns={this.state.devicecol} dataSource={this.state.devicedata} rowSelection={this.rowSelection} size='middle' style={{backgroundColor:'#1B2143',marginTop:'1rem'}}></Table>
                </Card>
                <Modal title='修改部门ID' visible={this.state.modifyvisi} footer={null} onCancel={this.handleCancel} >
                    <Form {...ItemLayout} onSubmit={this.idsub}>
                        <Form.Item label='原部门ID' hasFeedback>
                            {getFieldDecorator('original',{
                                rules:[{required:true,message:'请输入原部门ID',whitespace:true}],
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item label='新部门ID' hasFeedback>
                            {getFieldDecorator('new',{
                                rules:[{required:true,message:'请输入新部门ID',whitespace:true}]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item {...newLayouot}>
                            <Button onClick={this.formreset}>重置</Button> 
                            <Button type='primary' htmlType='submit' className='btn'>确定</Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}
const MgrForm = Form.create({ name: 'MgrForm' })(mgr);
export default MgrForm;