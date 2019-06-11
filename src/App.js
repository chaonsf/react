import React, {Component} from 'react'   /*  Fragment就相当于vue中的template，一个虚拟的元素标签*/
import { Form,Input,Button,Message } from 'element-react';
import 'element-theme-default';
import extendsApi from "./services/extendApi"
let api=new extendsApi()


class Xiaojiejie extends Component{
    constructor(props){
         super(props)
         this.state={
             form:{
                USUS_LOGIN:"",
                USUS_PSWD:""
             }
         }
    }
    handleSubmit(e){
        e.preventDefault();
            console.log(this.state.form)
            let obj={
                m : 'login',
                DB_NAME : 'USER',
                SP_NAME : 'SP_LOGIN' 
            }
            let end=Object.assign(obj,this.state.form);
            api.sendPost("Handler/DentalHandler.ashx",end).then(res=>{
                  console.log(res.data)
                  let data=res.data.content;
                  if(data.RETURN_CODE==0){
                     /* 页面跳转 */
                     window.localStorage.setItem("RETURN_NAME", data.RETURN_NAME)
                     window.localStorage.setItem("RETURN_LOGIN_TOKEN", data.RETURN_LOGIN_TOKEN)
                     this.props.history.push("/detail")
                    
                  }else{
                      Message({
                           message: data.RETURN_MESSAGE,
                           type:"warning"
                      })
                  }
            })
    }
    onChange(key,value){
        this.setState({
            form: Object.assign({}, this.state.form, { [key]: value })
          });
    }
    inputKeyUp(e){
        if(e.keyCode == 13){
            this.handleSubmit()
        }
    }
    render(){
        return  (
            <div className="login">
            <h3>口腔健康状况测试登陆</h3>
              <Form model={this.state.form}>
                <Form.Item label="登录名">
                     <Input value={this.state.form.USUS_LOGIN} onChange={this.onChange.bind(this,"USUS_LOGIN")} type="text"></Input>
                </Form.Item>
                <Form.Item label="密码">
                      <Input type="password" value={this.state.form.USUS_PSWD} onChange={this.onChange.bind(this, 'USUS_PSWD')} autoComplete="off" onKeyUp={this.inputKeyUp}/>
                </Form.Item>
                <Form.Item>
                     <Button type="primary" onClick={this.handleSubmit.bind(this)}>登陆</Button>
                </Form.Item>
            </Form>
          </div>

        )
    }
}

export default Xiaojiejie
