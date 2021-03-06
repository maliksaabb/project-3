import React, { Component } from "react";
import { render } from "react-dom";
import axios from "axios";
import PropTypes from "prop-types";
import Graph from "../graph/graph";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/authActions";
import { Col, Row, Container } from "../containers/FluidContainer"
import "./Profile.css";

const BASE_URL = "http://localhost:5000/";

class Profile extends Component {
  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

 

  //START OF IMAGE UPLOADER FUNCTIONS / STATE
  constructor(props) {
      super(props);
      this.state = {
      images: [],
      imageUrls: [],
      message: ''
      }
   }
  selectImages = (event) => {
      let images = []
        for (var i = 0; i < event.target.files.length; i++) {
        images[i] = event.target.files.item(i);
      }
        images = images.filter(image => image.name.match(/\.(jpg|jpeg|png|gif)$/))
        let message = `${images.length} valid image(s) selected`
        this.setState({ images, message })
  }
  uploadImages = () => {
    const uploaders = this.state.images.map(image => {
    const data = new FormData();
    data.append("image", image, image.name);
     
    // Make an AJAX upload request using Axios
    return axios.post('/api/upload', data)
    .then(response => {
    this.setState({
    imageUrls: [ response.data.imageUrl, ...this.state.imageUrls ]
    });
    })
    });
     
    // Once all the files are uploaded 
    axios.all(uploaders).then(() => {
    console.log('done');
    }).catch(err => alert(err.message));
    }
    //END OF IMAGE UPLOADER FUNCTIONS



  render() {
    const { user } = this.props.auth;

    return (
      <Container fluid className="wholeProfileDiv">
        <Row>
          <Col size="md-6">
      <div style={{ height: "75vh" }} className="container valign-wrapper2">
          <div className="landing-copy">
            <div className="blankfornow" style={{}}>
            <h2>
              Welcome back, {user.name.split(" ")[0]}!
            </h2>
            {/* <div>
              <img href="/"></img>
            </div> */}
            <br></br>
            <div className="newtag">
                <img src="/images/uploads/Selfie.jpg" alt="profilePicture" className="me"
                >
                </img>
            </div>
            <br></br><br></br><br></br>
            <h5>Tired of your profile photo? Upload a new one!</h5>
              <input className="form-control " type="file" 
              onChange={this.selectImages} multiple/>
               <p className="text-info">{this.state.message}</p>
                <br></br>
               <button className="btn btn-primary" value="Submit" 
                  onClick={this.uploadImages}>Submit</button>
          </div>
          <div className="imageHolder">
            { 
              this.state.imageUrls.map((url, i) => (
              <div className="imageStuff" key={i}>
              <img src={BASE_URL + url} className="img-rounded img-responsive"
              alt="not available"/><br/>
              </div>
              ))
            }
          </div>


          </div>
      </div>
        
           </Col>
        
            <Col size="md-6">
             <div style={{ height: "75vh" }} className="profileGraph">
                <h2> 
                    Total Monthly Earnings for {user.name.split(" ")[0]}
                    </h2>
                <Graph />

              
             </div>

           </Col>

        </Row>

          <div style={{}} className="LogoutDiv">
            <button
              style={{
                fontFamily: "monospace",
                fontSize:"10px",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "2.5px",
                marginTop: "1rem"
              }}
              onClick={this.onLogoutClick}
              className="btn logout btn-large gold"
            >
              <strong>
              Logout
              </strong>
            </button>
            <Link to="/dashboard">
            <button
              style={{
                fontFamily: "monospace",
                fontSize:"10px",
                width: "150px",
                borderRadius: "3px",
                letterSpacing: "2.5px",
                marginTop: "1rem"
              }}
              className="btn logout btn-large gold"
            >
              <strong>
              Dashboard
              </strong>
            </button>
            </Link>
          </div>
    </Container>
    );
  }
}

Profile.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Profile);
