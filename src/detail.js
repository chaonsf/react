import React, {Component,Fragment} from 'react'   /*  Fragment就相当于vue中的template，一个虚拟的元素标签*/
import {Input,Form,DatePicker,Button,Loading,Table,Pagination,Dialog,Checkbox} from 'element-react';
import 'element-theme-default';
import extendsApi from "./services/extendApi"
let api=new extendsApi()
var moment = require('moment');



class Xiaojiejie extends Component{
   constructor(props){
       super(props);
       this.state={
            form:{
                START_DATE:new Date(),
                END_DATE:new Date(),
                QUERY_MEME:"",
                QUERY_INSURER:"",
                page:1, //多少页
                rows:9, //一页多少条
                total:0 , //获得数据的总条数
                APPLY_REASON:"",   //dialog上的备注
                PDPD_SUCCESS_IND:[]  //dialog 中checkbox是否已投保
            },
            fullscreen: false,//控制loading显示隐藏
            dialog:false,
            ORDER_NO:null,//记录点击的那条数据的key值
            columns:[
                {type:"index"},
                {label:"保险渠道(经办人)",prop:"channer"},
                {label:"投保人(手机)",width:210,prop:"user"},
                {label:"保险使用人(手机)",width:210,prop:"insu"},
                {label:"总得分",width:100,prop:"TOTAL_SCORE"},
                {label:"状态",width:80,prop:"status"},
                {label:"投保状态",width:100,prop:"PDPD_SUCCESS_IND_DESC"},
                {label:"创建时间",width:180,prop:"ORDER_TIME"},
                {label:"操作",width:160,
                  render:function(){
                    return (
                        <span>
                         <Button plain={true} type="info" size="small">编辑</Button>
                         <Button type="success" size="small">投保情况</Button>
                        </span>
                      )
                  }
               }
            ],
            tableData:[]
       }
       
   }
   componentDidMount(){ //相当于vue中的create
       this.query()
   }
   onChange(key,value){  //搜索区域的表格
     this.setState({
         form: Object.assign({}, this.state.form, { [key]: value })
      });
   }
   query(){
        var obj={
            DB_NAME:"DENTAL_CUSTOMER_SERVICE",
            SP_NAME:"SP_INQU_ANSWER_ORDER_LIST",
            m:"LIST",
            rows:this.state.form.rows,
            page:this.state.form.page,
            START_DATE:moment(this.state.form.START_DATE).format("YYYY-MM-DD"),
            END_DATE:moment(this.state.form.END_DATE).format("YYYY-MM-DD"),
            QUERY_MEME:this.state.form.QUERY_MEME,
            QUERY_INSURER:this.state.form.QUERY_INSURER
        }
        this.setState({
            fullscreen: true
          });
          api.sendPost("handler/actiondata.ashx",obj).then(res=>{
            this.setState({fullscreen:false})
            let data=res.data.content.rows;
            data.forEach(item=>{
                 if(item.INSURER_EMP_NAME){  //保险渠道
                     item.channer=item.INSURER_COMPANY+"("+item.INSURER_EMP_NAME+")"
                 }else{
                    item.channer=item.INSURER_COMPANY
                 }
                 if(item.USER_PHONE){ //投保人
                     item.user=item.USER_NAME+"("+item.USER_PHONE+")"
                 }else{
                    item.user=item.USER_NAME
                 }
                 if(item.INSURANCE_MEME_PHONE){ //保险使用人
                     item.insu=item.INSURANCE_MEME_NAME+"("+item.INSURANCE_MEME_PHONE+")"
                 }else{
                    item.insu=item.INSURANCE_MEME_NAME
                 }
                 if(item.ORDER_STATUS=="01"){
                     item.status="待发布"
                 }else{
                    item.status="已发布" 
                 }
            })
            this.setState({
                tableData:data,
                form:Object.assign({},this.state.form,{total:res.data.content.total})
            })
       })

   }
   pageChange(currentPage){
       console.log(currentPage)
       this.setState({  //setState是异步的，后面回调时更新后处理的事件
        form:Object.assign({},this.state.form,{page:currentPage}) 
       },()=>{
           this.query()
       })
       
   }
   edit(row, column, cell, event){ 
       if(event.target.innerHTML=="编辑"){
             console.log("编辑");
             this.props.history.push("/chart?ORDER_NO="+row.ORDER_NO)
           
       }else if(event.target.innerHTML=="投保情况"){
           //投保情况
           this.setState({dialog:true,ORDER_NO:row.ORDER_NO,form:Object.assign({},this.state.form,{APPLY_REASON:"",PDPD_SUCCESS_IND:[]})});
           let obj={
            ORDER_NO:row.ORDER_NO,
            SP_NAME:"SP_INQU_ANSWER_ORDER_PDPD_INFO_SELECT",
            DB_NAME:"DENTAL_CUSTOMER_SERVICE",
            m:"select"
          }
          api.sendPost("handler/actiondata.ashx",obj).then(res=>{
              let data=res.data.content
               if(data.length>0){
                   this.setState({
                       form:Object.assign({},this.state.form,{APPLY_REASON:data[0].APPLY_REASON,PDPD_SUCCESS_IND:[data[0].PDPD_SUCCESS_IND]})
                   })
               }
           })


       }
   }
   dialogSubmit(){
       console.log(this.state.form)
        let obj={
            ORDER_NO:this.state.ORDER_NO,
            PDPD_SUCCESS_IND:this.state.form.PDPD_SUCCESS_IND[0]=="Y"|| this.state.form.PDPD_SUCCESS_IND.length>1?"Y":"N",
            APPLY_REASON:this.state.form.APPLY_REASON,
            SP_NAME:"SP_INQU_ANSWER_ORDER_PDPD_INFO_INSERT",
            DB_NAME:"DENTAL_CUSTOMER_SERVICE",
            m:"INSERT"
        }
        this.setState({
            fullscreen:true
        })
        api.sendPost("handler/actiondata.ashx",obj).then(res=>{
            this.setState({
                fullscreen:false
            })
            let data=res.data.content
            if(data.RETURN_CODE==0){
                 this.setState({
                     dialog:false
                 },()=>{
                     this.query()
                 })
                
            }
        })

   }
    render(){
        return  (
           <Fragment>
              <Loading text="拼命加载中" loading={this.state.fullscreen}>
               <div className='queryArea'>
                    <Form inline={true} model={this.state.form}>
                        <Form.Item prop="START_DATE">
                            <DatePicker value={this.state.form.START_DATE}  placeholder="开始时间" onChange={this.onChange.bind(this,"START_DATE")}></DatePicker>
                        </Form.Item>
                         <Form.Item prop="END_DATE">
                         <DatePicker value={this.state.form.END_DATE}  placeholder="结束时间" onChange={this.onChange.bind(this,"END_DATE")}></DatePicker>
                         </Form.Item>
                         <Form.Item>
                             <Input placeholder="投保人、使用人姓名/联系方式" value={this.state.form.QUERY_MEME} onChange={this.onChange.bind(this,"QUERY_MEME")}></Input>
                         </Form.Item>
                         <Form.Item>
                             <Input placeholder="保险渠道/经办人" value={this.state.form.QUERY_INSURER} onChange={this.onChange.bind(this,"QUERY_INSURER")}></Input>
                         </Form.Item>
                         <Form.Item>
                             <Button  type="primary" onClick={this.query.bind(this)}>查询</Button>
                        </Form.Item>
                    </Form>
                    <Table columns={this.state.columns} data={this.state.tableData} onCellClick={this.edit.bind(this)}>
                           
                    </Table>
                    <Pagination layout="total, prev, pager, next, jumper" total={this.state.form.total} pageSize={this.state.form.rows} onCurrentChange={this.pageChange.bind(this)}></Pagination>
               </div>
               <Dialog visible={this.state.dialog} title="投保情况" onCancel={()=>this.setState({dialog:false})} size="small">
                   <Dialog.Body>
                        <Form model={this.state.form}>
                             <Form.Item label="是否已投保">
                                  <Checkbox.Group value={this.state.form.PDPD_SUCCESS_IND} onChange={this.onChange.bind(this,"PDPD_SUCCESS_IND")}> 
                                     <Checkbox  name="type" value="Y"></Checkbox>
                                 </Checkbox.Group>
                                  
                             </Form.Item>
                             <Form.Item label="备注">
                                 <Input  type="textarea" value={this.state.form.APPLY_REASON} onChange={this.onChange.bind(this,"APPLY_REASON")} size="small" autosize={{ minRows: 2, maxRows: 4}}></Input>
                             </Form.Item>
                        </Form>
                   </Dialog.Body>
                   <Dialog.Footer className="dialog-footer">
                         <Button onClick={()=>this.setState({dialog:false})}>取消</Button>
                         <Button type="primary" onClick={this.dialogSubmit.bind(this)}>确定</Button>
                   </Dialog.Footer>
               </Dialog>
               </Loading>
           </Fragment>
        )
    }
}

export default Xiaojiejie