import {View, StyleSheet, Animated, Dimensions, Text} from 'react-native';
import React from 'react';
import { Colors }   from '../styling/Colors.js';
import { useEffect } from 'react';
import { useLayoutEffect, useRef } from 'react';

const {width} = Dimensions.get('window');

/**
 * 
 * Displays Animated progress bar where progress/total % will be filled in
 * @param {Number} progress - progress towards total value, % will fill the bar
 * @param {Number} total - total value to be me
 */
export default function RankProgressBar({progress, total}) {


    const initWidth = useRef(new Animated.Value(0)).current;
    useEffect (() => {
        Animated.spring(initWidth, {
            toValue : progress/total*width*2/3.3,
            bounciness : 10,
            speed : 2,
            useNativeDriver : false
        }).start();
    }, []);

    return (
        <View style = {styles.RankProgBarContainer}>
            {(progress !== total) &&
                <View style = {styles.loadingBar}>
                <Animated.View style={[styles.progressBar, {width : initWidth}]}/>
                </View>
            }
            <View style = {{flexDirection : 'row', flex : 1, justifyContent : 'center'}}>
                <Text style = {styles.numerator}>{progress} </Text>
                {(progress !== total) && <Text style = {styles.denominator}>/ {total}</Text>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    RankProgBarContainer : {
        flex : 1,
        // justifyContent : 'flex-end'
    },
    loadingBar : {
        width : '100%',
        borderRadius : 15,
        backgroundColor : "#DDE1E4",
        flex : 0.25,
    },
    progressBar : {
        backgroundColor : Colors.secondary.LIGHT_MINT,
        width : 0, 
        height : 10, 
        borderRadius : 15,
        flex : 1
    },
    numerator : {
        fontSize : 14, 
        fontWeight  : 'bold',
        color : Colors.secondary.DARK_MINT
    },
    denominator  : {
        fontSize : 14,
        fontWeight : 'bold',
    },
});