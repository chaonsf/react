import React, {Component,Fragment} from 'react'   /*  Fragment就相当于vue中的template，一个虚拟的元素标签*/
import {Input,Form,DatePicker,Button,Loading,Table,Card,Layout, Message} from 'element-react';
import 'element-theme-default';
import extendsApi from "./services/extendApi";
let api=new extendsApi()
var moment = require('moment');



class Xiaojiejie extends Component{
   constructor(props){
       super(props);
       this.state={
          ORDER_NO:null,  //key值
          loading:false, //控制loading遮罩层
          MessData:null, //请求得到的人员信息数据
          qusData:null,  //客户答题数据
       }
       
   }
  componentDidMount(){
       let search=this.props.location.search;
       let no=search.substring(10,search.length);
       this.setState({
        ORDER_NO:no,
        loading:true
       })
       let obj={
         ORDER_NO:no,
         SP_NAME:"SP_INQU_ANSWER_RESULT_DISPLAY_LIST",
         m:"multi_result",
         DB_NAME:"DENTAL_CUSTOMER_SERVICE",
       }
       
       api.sendPost("handler/actiondata.ashx",obj).then(res=>{
             let data=res.data.content;
             if(data.result.EMPTY){
                Message.error(data.result.ANSWER_MESSAGE)
             }else{
                this.setState({
                    MessData:data
                })
                
             }

       })
       let qus={
          ORDER_NO:no,
          SP_NAME:"SP_INQU_QUESTION_LIST",
          m:"multi_result",
          DB_NAME:"DENTAL_CUSTOMER_SERVICE",
       }
       api.sendPost("handler/actiondata.ashx",qus).then(res=>{
           this.setState({
              loading:false
           })
           console.log(res.data.content)
       })
      
   }

    render(){
        return  (
           <Fragment>
                  <Loading text="拼命加载中" loading={this.state.loading}>
                       <Layout.Row gutter="10">
                            <Layout.Col span="6">
                                <Card header={ <span style={{ "lineHeight": "18px" }}>客户信息</span>}>
                                     <div className="text item" ><strong>投保人:</strong>{this.state.ORDER_NO}</div>
                                     <div className="text item" ><strong>联系方式:</strong>{this.state.ORDER_NO}</div>
                                     <div className="text item" ><strong>保险使用人:</strong>{this.state.ORDER_NO}</div>
                                     <div className="text item" ><strong>联系方式:</strong>{this.state.ORDER_NO}</div>
                                     <div className="text item" ><strong>出生日期:</strong>{this.state.ORDER_NO}</div>
                                     <div className="text item" ><strong>性别:</strong>{this.state.ORDER_NO}</div>
                                </Card>
                            </Layout.Col>
                       </Layout.Row>

                   </Loading>
           </Fragment>
        )
    }
}

export default Xiaojiejie