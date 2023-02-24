import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [dreamAnalysisDescriptionInput,setDreamAnalysisDescription] = useState("");
  const [dreamFeelingInput, setDreamFeeling] = useState("");
  const [walkingInfluenceInput, setWalkingInfluence] = useState("");
  const [dreamOptimizeInput,setDreamOptimize] = useState("");
  const [dreamImageDescriptionInput,setDreamImageDescription] = useState("");
  const [result, setResult] = useState();
  const [url,setUrl] = useState("")

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({dreamAnalysisDescription:dreamAnalysisDescriptionInput,dreamFeeling:dreamFeelingInput,walkingInfluence:walkingInfluenceInput,dreamOptimize:dreamOptimizeInput,dreamImageDescription:dreamAnalysisDescriptionInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setUrl(data.url);
      console.log(data)
      
      setDreamAnalysisDescription("");
      setDreamFeeling("");
      setWalkingInfluence("");
      setDreamImageDescription("");
      setDreamOptimize("")
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <main className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Generate Your Dream NFT</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="dreamAnalysisDescription"
            placeholder="Describe your dream to me"
            value={dreamAnalysisDescriptionInput}
            onChange={(e) => setDreamAnalysisDescription(e.target.value)}
          />
          <input
            type="text"
            name="dreamFeeling"
            placeholder="How did this dream make you feel"
            value={dreamFeelingInput}
            onChange={(e) => setDreamFeeling(e.target.value)}
          />
          <input
            type="text"
            name="walkingInfluence"
            placeholder="What in your waking life do you think influenced this dream?"
            value={walkingInfluenceInput}
            onChange={(e) => setWalkingInfluence(e.target.value)}
          />
          <input
            type="text"
            name="dreamImageDescription"
            placeholder="Describe the most memorable moment of your dream to me"
            value={dreamImageDescriptionInput}
            onChange={(e) => setDreamImageDescription(e.target.value)}
          />
          <input
            type="text"
            name="dreamOptimize"
            placeholder="In what style of art would you like your dream to reflect?"
            value={dreamOptimizeInput}
            onChange={(e) => setDreamOptimize(e.target.value)}
          />
          <input type="submit" value="Generate Dream" />
        </form>
        <div className={styles.result}>{result}</div>
        <div className={styles.images}>
          <img src={url}/>
        </div>
      </main>
    </div>
  );
}
