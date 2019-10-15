import React, { Component } from 'react';
import {Table, Card, Icon, Input, Button, Tag} from 'antd'
import 'antd/dist/antd.css'
import Highlighter from 'react-highlight-words'
import axios from 'axios'


const MyIcon = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1418139_m2haq8kj3le.js', 
  });
class log extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            logcolums : [
                {title:'设备ID', dataIndex:'deviceid' ,key:'deviceid', ...this.getColumnSearchProps('deviceid')},
                {title:'部门ID', dataIndex:'deparid' ,key:'deparid', defaultSorOrder:'descend',sorter: (a, b) => a.deparid - b.deparid},
                {title:'用户ID', dataIndex:'userid', key:'userid'},
                {title:'上线时间', dataIndex:'online', key:'online'},
                {title:'认证类型', dataIndex:'types', key:'types', render: types => {
                    if(types === '指纹认证'){
                        return(
                            <span>
                                <MyIcon type='icon-huabanfuben'></MyIcon><span style={{margin:'0 .5rem'}}>{types}</span>
                            </span>
                        )
                    }
                    else if(types === '口令认证'){
                        return(
                            <span>
                                <MyIcon type='icon-xiugairenzhengkouling'></MyIcon><span style={{margin:'0 .5rem'}}>{types}</span>
                            </span>
                        )
                    }
                }},
                {title:'认证状态', dataIndex:'status', key:'status', render: status=>{
                    if(status === 'ok'){
                        return(
                            <span>
                                <Tag color='green'>成功</Tag>
                            </span>
                        )
                    }
                    else if(status === 'error'){
                        return(
                            <span>
                                <Tag color='red'>失败</Tag>
                            </span>
                        )
                    }
                }}
            ],
            logdata:[
                {key:'1',deviceid:'32132',deparid:'002',userid:'das122',online:'2019.05.09-14:23:43',types:'指纹认证',status:'ok'},
                {key:'2',deviceid:'32132',deparid:'001',userid:'das122',online:'2019.05.09-14:23:43',types:'指纹认证',status:'error'},
                {key:'3',deviceid:'32132',deparid:'003',userid:'das122',online:'2019.05.09-14:23:43',types:'口令认证',status:'error'}
            ]
         };
    }
    componentDidMount(){
        axios.get().then(res=>{
            console.log(res)
        }).catch(err=>{
            console.log(err)
        })
    }
    getColumnSearchProps = dataIndex => ({
        filterDropdown: ({setSelectedKeys,selectedKeys,confirm,clearFilters})=>(
            <div style={{ padding : 8 }}>
                <Input ref={node => {
                    this.searchInput = node
                }}
                placeholder = {`Search ${dataIndex}`}
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                style={{width:188 ,marginButton:8, display:'block'}}
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
            <Icon type='search' style={{color:filtered ? '#1890ff' : undefined}}></Icon>
        ),
        onFilter: (value,record) =>
        record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        onFIlterDropdownVisibleChange: visible => {
            if(visible){
                setTimeout(()=> this.searchInput.select())
            }
        },
        render: text => (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[this.state.searchText]}
                autoEscape
                textToHighlight={text.toString()}
            />
        )
    })
    handleSearch = (selectedKeys, confirm) => {
        confirm();
        this.setState({ searchText: selectedKeys[0] });
        };
    
    handleReset = clearFilters => {
        clearFilters();
        this.setState({ searchText: '' });
    };
    
    render() {
        return (
            <div style={{margin:'1rem'}}>
                <Card size='small' title='日志' bordered={false} style={{backgroundColor:'#1B2143'}}>
                    <Table columns={this.state.logcolums} dataSource={this.state.logdata} size='middle' style={{backgroundColor:'#1B2143',marginTop:'.5rem'}}></Table>
                </Card>
            </div>
        );
    }
}

export default log;