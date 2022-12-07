import { Box } from '@mui/system'
import React, { useEffect, useState,useRef } from 'react'
import JoinMeeting from './JoinMeeting'
import io from 'socket.io-client';
import Peer from "simple-peer";
import { CopyToClipboard } from 'react-copy-to-clipboard';



const socket = io.connect("http://localhost:3001")

const MeetingScreen = () => {
    const [roomId, setroomId] = useState();
    const [userName, setuserName] = useState()

    const [myName, setmyName] = useState("");
    const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ caller, setCaller ] = useState("")
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ idToCall, setIdToCall ] = useState("")
	const [ callEnded, setCallEnded] = useState(false)
	const [ name, setName ] = useState("")
	const myVideo = useRef()
	const userVideo = useRef()
	const connectionRef= useRef()

   
    useEffect(()=>{
      const constraints = {
        'video': true,
        'audio': true
    }
     navigator.mediaDevices.getUserMedia(constraints)
     .then((stream)=>{
      setStream(stream)
       myVideo.srcObject= stream;
      console.log(stream,"Got mediaStream");
       
     })
     .catch((error)=>{
      console.log(error);
     })
     socket.on("me",(id)=>{
      setmyName(id)
     })
     
     socket.on("callUser",(data)=>{
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
     })
     
    },[]);

    const callUser = (id)=>{
      const peer = new Peer({
        initiator: true,
        trickle:false,
        stream:stream
      })
      peer.om("signal",(data)=>{
        socket.emit("callUser",{
          userToCall:id,
          signalData:data,
          from:myName,
          name:name
        })
      })
      peer.on("stream",(stream)=>{
        userVideo.srcObject=stream;

      })
      socket.on("callAccepted",(signal)=>{
        setCallAccepted(true);
        peer.signal(signal);
      })
      connectionRef.current = peer;

   }




  return (
    <Box>
        <JoinMeeting
        name={userName} setuserName={setuserName} 
        roomID={roomId} setroomId={setroomId}
        />
    </Box>
  )
}

export default MeetingScreen