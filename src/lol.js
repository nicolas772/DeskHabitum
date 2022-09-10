    if (posesHand.length == 2){

        bocaLeft = posesBlaze[0].keypoints[9]
        bocaRight = posesBlaze[0].keypoints[10]

        bocaLeft3D = posesBlaze[0].keypoints3D[9]
        bocaRight3D = posesBlaze[0].keypoints3D[10]

        ojoLeft3D = posesBlaze[0].keypoints3D[2]
        ojoRight3D = posesBlaze[0].keypoints3D[5]
        //Distancia entre ojos mirando de frente
        distancia_ojos = 0.030

        hombroLeft3D = posesBlaze[0].keypoints3D[11]
        hombroRight3D = posesBlaze[0].keypoints3D[12]

        nariz = posesBlaze[0].keypoints[0]
        nariz3D = posesBlaze[0].keypoints3D[0]

        orejaLeft = posesBlaze[0].keypoints[7]
        orejaRight = posesBlaze[0].keypoints[8]

        orejaLeft3D = posesBlaze[0].keypoints3D[7]
        orejaRight3D = posesBlaze[0].keypoints3D[8]

        //Se define el centro de la boca en base a las coordenadas estimadas
        bocaCenter_x = (bocaLeft.x + bocaRight.x) / 2.0
        bocaCenter_y = (bocaLeft.y + bocaRight.y) / 2.0

        //Se define un radio de detección desde el centro de la boca hasta el coef definido 
        coef = 10;

        radioXUp = bocaCenter_x + coef
        radioXLow = bocaCenter_x - coef

        radioYUp = bocaCenter_y - coef
        radioYLow = bocaCenter_y + coef

        //Se consideran las articulaciones interfalángicas distales de la mano detectada
        dipPulgar = posesHand[0].keypoints[3]
        dipIndice = posesHand[0].keypoints[7]
        dipMedio = posesHand[0].keypoints[11]
        dipAnular = posesHand[0].keypoints[15]
        dipMenique = posesHand[0].keypoints[19]

        //Tambien las puntas de los dedos
        tipPulgar = posesHand[0].keypoints[4]
        tipPulgar3D = posesHand[0].keypoints3D[4]

        tipIndice = posesHand[0].keypoints[8]
        tipIndice3D = posesHand[0].keypoints3D[8]

        tipMedio = posesHand[0].keypoints[12]
        tipMedio3D = posesHand[0].keypoints3D[12]

        tipAnular = posesHand[0].keypoints[16]
        tipAnular3D = posesHand[0].keypoints3D[16]

        tipMenique = posesHand[0].keypoints[20]
        tipMenique3D = posesHand[0].keypoints3D[20]

        muñeca3D = posesHand[0].keypoints3D[0]
    }
