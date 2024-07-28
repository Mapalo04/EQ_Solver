import { StyleSheet, Text, View, useWindowDimensions } from 'react-native'
import React from 'react'
import RenderHTML from 'react-native-render-html';

const ContentHtml = ({sourceC, colors="black"}) => {
    const {width} = useWindowDimensions();
    const source={
        html: sourceC
      }
    const mixedStyle = {
        body: {
          whiteSpace: 'normal',
          color: colors
        },

      }
      return(
        <View>
          <RenderHTML
            contentWidth={width*0.8}
            source={source}
            tagsStyles={mixedStyle}
            />
        </View>
      )
}

export default ContentHtml

const styles = StyleSheet.create({})