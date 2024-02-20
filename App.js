import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { firestore, collection, addDoc, serverTimestamp, MESSAGES } from './Firebase/Config';
import { convertFirebaseTimeStampToJS } from './helpers/Functions';
import { query, onSnapshot } from 'firebase/firestore';

export default function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  const save = async() => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch (error => console.log(error))
    setNewMessage("")
    console.log("Message saved.")
  }

  useEffect(() => {
    const q = query(collection(firestore,MESSAGES))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []

      querySnapshot.forEach((doc) => {
        const messageObject = {
          id: doc.id,
          text: doc.data().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }
        tempMessages.push(messageObject)
      })
      setMessages(tempMessages)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {
          messages.map((message) => (
            <View style={styles.message} key={message.id}>
              <Text style={styles.messageInfo}>{message.created}</Text>
              <Text>{message.text}</Text>
            </View>
          ))
        }
      </ScrollView>
      <View style={styles.container}>
      <TextInput placeholder='Send message...' value={newMessage} onChangeText={text => setNewMessage(text)} />
      <Button title="Send" type="button" onPress={save} />
      <StatusBar style="auto" />
    </View>
    </SafeAreaView>

    
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: ConstantSourceNode.statusBarHeight,
    flex: 1,
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#f5f5f5",
    borderColor: "#ccc",
    borderRadius: 5,
    borderWidth: 1,
    marginLeft: 10,
    marginRight: 10
  },
  messageInfo: {
    fontSize: 12
  }
});
