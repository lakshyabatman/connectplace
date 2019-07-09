import React,{Component} from 'react'
import {Autocomplete,Col,Row,Button,Icon,TextInput,Textarea, Card,Select} from 'react-materialize'
import Tag1 from './tag1.js'
import {addPost} from '../../action/post'
import {connect} from 'react-redux'

const lang= {"Gus Fring": null,"Saul Goodman": null,"Tuco Salamanca": 'https://placehold.it/250x250'};
const comp={"Gus Fring": null,"Saul Goodman": null,"Tuco Salamanca": 'https://placehold.it/250x250'};
class AddPost extends Component{
    constructor(props) {
        super(props);
        this.state = {
            langtags:[],
            comptags:[],
            category:'',
            content:'',
            ques:''
        };

    }
    change=(e)=>{
        console.log(e.target.value)
        this.setState({
            category:e.target.value
        })
        console.log(this.state.category)
    }
    change2=(e)=>{
        console.log(e.target.value)
        this.setState({
            ques:e.target.value
        })
        console.log(this.state.ques)
    }
    change3=(e)=>{
        console.log(e.target.value)
        this.setState({
            content:e.target.value
        })
    }
    enterPressed1 = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { 
            var tmp=event.target.value;
            if(tmp!=="")
            {
                const tmp1=this.state.langtags;
                tmp1.push(tmp);
                this.setState({langtags:tmp1})
            }
            event.target.value='';
            // alert(this.state.langtags);
        } 
    }
    enterPressed2 = (event) => {
        var code = event.keyCode || event.which;
        if(code === 13) { 
            var tmp=event.target.value;
            if(tmp!=="")
            {
                const tmp1=this.state.comptags;
                tmp1.push(tmp);
                this.setState({comptags:tmp1})
            }
            event.target.value='';
            // alert(this.state.comptags);
        } 
    }
    submit=(e)=>{
        e.preventDefault();
        let data={
            category:this.state.category,
            content:this.state.content,
            ques:this.state.ques,
            language:this.state.langtags,
            topic:this.state.comptags
        }
       this.props.addPost(data,this.props.history)
    }
    render(){
        return(
            <Row>
                <center>
                    <form>
                <Col m={3} s={12}></Col>
                <Col m={6} s={12}>
            
                <Card className="blue-grey darken-1" style={{color:"white",fontSize:'1.5em'}}>
                <Row>
                        <br></br>
                        <div>Category :</div>
                        <Col s={1}></Col>
                        <Select value={this.state.category} onChange={this.change}>
                <option disabled>
                Select
                </option>
                <option value="Interview Exprience">
               Interview Experience
                </option>
                <option value="General Query">
                General Query
                </option>
                </Select>
                    </Row>
               
                    <Row>
                        <br></br>
                        <div>Title :</div>
                        <Col s={1}></Col>
                        <TextInput s={10} onChange={this.change2} value={this.ques}/>
                    </Row>

                    <Row>
                        <div>Languages :</div>
                        <Col m={1} s={1}></Col>
                        <Autocomplete onKeyPress={this.enterPressed1.bind(this)}
                         m={10} s={10}
                         options={{data:lang}}
                         placeholder="Enter languages and press Enter" />
                        <Col m={1} s={1}></Col>
                        {this.state.langtags.map((value, index) => {
                                    if(value!=="")
                                        return <Tag1 name={value}></Tag1>
                                    else
                                        return null;
                        })}
                        
                    </Row>
                    <Row>
                        <div>Company :</div>
                        <Col s={1}></Col>
                        <Autocomplete onKeyPress={this.enterPressed2.bind(this)}
                         s={10} 
                         options={{data:comp}}
                         placeholder="Enter company name and press Enter" />
                        <Col s={1}></Col>
                        {this.state.comptags.map((value, index) => {
                                    if(value!=="")
                                        return <Tag1 name={value}></Tag1>
                                    else
                                        return null;
                        })}
                    </Row>
                    <Row style={{marginBottom:0}}>
                        <div>Description :</div>
                        <Col s={1}></Col>
                        <Textarea data-length={1000} style={{height:"10em",border:"1px solid white",padding:"1em"}}
                          s={10}
                          m={10}
                          l={10}
                          xl={10}
                            value={this.content}
                            onChange={this.change3}
                        />
                    </Row>
                    <Button type="submit" waves="light" style={{marginBottom:"10px"}} onClick={this.submit}>
                        Submit
                        <Icon right>
                        send
                        </Icon>
                    </Button>
                </Card>
                </Col>
                <Col m={3} s={12}></Col>
                </form>
                </center>
            </Row>
        )
    }
}
export default connect(null,{addPost})(AddPost)