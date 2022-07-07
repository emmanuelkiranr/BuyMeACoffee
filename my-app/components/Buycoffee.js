import { ethers } from "ethers";
import { useEffect, useState } from "react";
import abi from "../utils/BuyMeACoffee";

const Buycoffee = (props) => {
  const contractAddress = "0x9078e1c55f455bb8a3db34f0b2044e078c49d20a";
  const contractABI = abi.abi;

  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [memos, setMemos] = useState([]);

  const onNameChange = (event) => {
    setName(event.target.value);
    // using setName we set the value of variable name to the value that we got from the input field
  };

  const onMessageChange = (event) => {
    setMessage(event.target.value);
  };

  const buycoffee = async () => {
    try {
      {
        if (props.active) {
          //   const provider = new ethers.providers.Web3Provider(ethereum, "any");
          const provider = props.provider;
          // we connect to the metamask provider ie the rpc url metamask is using we connect to it
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
          console.log("buying coffee");
          const buycoffee = await contract.buyChai(
            name ? name : "Anom", // if name is true (ie it not a non empty string) then use that value else "Anom"
            message ? message : "Hello! Enjoy your coffee",
            { value: ethers.utils.parseEther("0.001") }
          );

          await buycoffee.wait();

          console.log("mined", buycoffee.hash);
          console.log("coffee purchased!");

          setName("");
          setMessage("");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const getMemo = async () => {
    try {
      if (props.active) {
        const provider = props.provider;
        const signer = provider.getSigner();
        console.log("fetching memos from the blockchain..");
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        const getMemos = await contract.getMemos();
        console.log("fetched!");
        setMemos(getMemos);
        /* getMemos is an array of many different memos, we set variable memos(intiially an empty array) with the 
        previously sent memos. So the variable memos will be an array of different memos. */
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    let contract;
    props.active;
    getMemo(); // calls getMemo so that when we open the app it is populated with the previous memos

    const NewMemo = (from, timestamp, name, message) => {
      // 3) since Buy event logs certain parameters we can access those
      console.log("Memo received: ", from, timestamp, name, message);

      /* 4) once the new memos is received from the Buy event we need to add it to the memos array without overwriting 
      the existing memos in that array so we use ...prevState
      So basically we take the prevState to it we add the new memos so the memos variable will store the 
      updated list of memos, which is then displayed in the page*/
      setMemos((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name,
        },
      ]);
    };
    try {
      /* 1) Listen to events (since we need the newly received memos to show up in the page automatically without
      refreshing we put this logic inside useEffect since when there is a state change[name & message] the app rerenders
      and so at that time everything inside the useEffect hook is also executed)*/
      if (props.active) {
        const provider = props.provider;
        const signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        contract.on("Buy", NewMemo);
        // 2) if the Buy event is emmited then we call the NewMemo fn
      }
      return () => {
        if (contract) {
          contract.off("Buy", NewMemo);
        }
      };
    } catch (e) {
      console.log(e);
    }
  }, []); // array to specifiy a condition and only if this condition is met useEffect hook is run
  /* everything inside this arrow fn is executed everytime the app renders
  (when there is a state change the app is rendered so useEffect executes everything inside it)
  */
  return (
    <>
      <div>
        {props.active ? (
          <form>
            <div>
              <label>Name:</label>
              <br />
              <input
                id="name"
                type="text"
                placeholder="anom"
                onChange={onNameChange} // when we change the value in the field we call the onNameChange fn
              />
            </div>
            <div>
              <label>Message:</label>
              <br />
              <textarea
                id="message"
                type="text"
                rows={4}
                placeholder="Hello! Enjoy your coffee"
                onChange={onMessageChange}
              />
            </div>
            <div>
              <button type="button" onClick={() => buycoffee()}>
                Send 1 coffee for 0.001 ETH
              </button>
            </div>
          </form>
        ) : (
          "please connect to metamask"
        )}
      </div>

      {props.active && <h1>Memos received</h1>}
      {props.active &&
        memos.map((memo, idx) => {
          /*  We use .map fn over this array memos(which is an array of struct) and fetct different structure 
          members and view it in the page.
          we take the first memo from memos and view it different members then second memo and so on.*/
          return (
            <div
              key={idx}
              style={{
                border: "2px solid",
                borderRadius: "5px",
                padding: "5px",
                margin: "5px",
              }}
            >
              <p style={{ fontWeight: "bold" }}>"{memo.message}"</p>
              <p>
                From: {memo.name} at {memo.timestamp.toString()}
              </p>
            </div>
          );
        })}
    </>
  );
};

export default Buycoffee;
