import * as React from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, Image, Button} from 'react-native';
import {useState, useEffect} from 'react';
import EducationMenu from '../../../components/EducationMenu';
import { electricity, food, recycle, transportation, water } from '../../../assets';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ScreenNames } from '../Main/ScreenNames.js';
import { API_URL } from '../../../config/Api';

// Using my test AWS node server for now
export default function ForumScreen({navigation}) {
    const [forumData, setForumData] = useState([]);
    const [loading, setLoading] = useState(true);

    // For now we fetch all of it, have to make an endpoint that allows fetching by category
    const fetchData = async() => {
        try {
            console.log("Fetching data for forumcontent");
            const response = await fetch(API_URL + "forumcontent");
            const data = await response.json();
            setForumData(data.content);
            setLoading(false);
        } catch (error) {
            console.log(error);
        }
    };

    const renderContent = ({item}) => {
        return(
            <View
                style = {{
                    borderRadius: 10,
                    backgroundColor: '#74C69D',
                    margin: 5,
                    width : '45%',
                    height: 180
                }}
            >
                <TouchableOpacity style={{ 
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                    }}
                    onPress={() => navigation.navigate(ScreenNames.QUIZ, { id: item.id_forumcontent})}
                >
                    <Text>
                        {item.type}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(() => {
        fetchData();
    }, []);

    const [type, setType] = useState("food");
    const styles = StyleSheet.create({
       row: {
           flexDirection:'row'
       }
    })

    return(
        <View>
            <View>
                <ScrollView>
                    <View style ={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 50, marginBottom: 75}}>
                        <EducationMenu
                            key={"food"}
                            title = "Food"
                            imageSrc = {food}
                                type ={type}
                                setType = {setType}
                        />
                        <EducationMenu
                                key={"transportation"}
                                title = "Transportation"
                                imageSrc = {transportation}
                                type ={type}
                                setType = {setType}
                        />
                        <EducationMenu
                            key={"recycling"}
                            title = "Recycling"
                            imageSrc = {recycle}
                                type ={type}
                                setType = {setType}
                        />
                        <EducationMenu
                            key={"water"}
                            title = "Water"
                            imageSrc = {water}
                                type ={type}
                                setType = {setType}
                        />
                        <EducationMenu
                            key={"electricity"}
                            title = "Electricity"
                            imageSrc = {electricity}
                            type ={type}
                            setType = {setType}
                        />
                    </View>
                </ScrollView>
            </View>
            <View>
                {loading && <Text>Loading</Text>}
                <FlatList
                    horizontal={false}
                    numColumns = {2}
                    data={forumData}
                    renderItem = {renderContent}
                    keyExtractor = {(item) => item.id_forumcontent.toString()}
                />
            </View>
        </View>
    )
}

