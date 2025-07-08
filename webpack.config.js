const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    performance: {
        maxAssetSize: 1000000,
        maxEntrypointSize: 1000000,
    },
    context: path.resolve(__dirname, 'src/main/react'),
    entry: {
        main: './pages/main/Main.js',
        user: './User.js',
        signup: './pages/SignUp/SignUp.js',
        noticelist: './pages/Notice/NoticeApp.js',
        qnawrite: './pages/Qna/QnaWrite.js',
        qnalist: './pages/Qna/QnaApp.js',
        idfind: './pages/IdFind/IdFind.js',
        idfindGood: './pages/IdFind/IdFindGood.js',
        pwchange: './pages/pwChange/pwChange.js',
        pwreset: './pages/pwChange/pwReset.js',
        login: './pages/Login/Login.js',
        lectureinfo: './pages/LectureInfo/LectureInfo.js',
        userinfo: './pages/UserInfo/UserInfo.js',
        community: './pages/community/community/Community.js',
        communitywrite: './pages/community/communityWrite/CommunityWrite.js',
        communitydetail: './pages/community/communityDetail/CommunityDetail.js',
        meeting: './pages/webrtc/Meeting.js',
        chat: './pages/webrtc/Chat.js',
        mypage: './pages/MyPage/MyPageApp.js',
        lecturedetail: './pages/Product/ProductDetails/ProductDetail.js',
        lectureregistration: './pages/Product/ProductRegistration/ProductRegistration.js',
        aipopup: './pages/webrtc/AIPopup',
        exitconfirmpopup: './pages/webrtc/ExitConfirmPopup',
        lecturereviewwrite: './pages/Product/ProductDetails/ProductDetailReviewWrite/ProductDetailReviewWrite.js',
    },
    output: {
        path: path.resolve(__dirname),
        filename: './src/main/resources/static/bundle/[name].bundle.js',
    },
    resolve: {
        alias: {
            react: path.resolve(__dirname, 'node_modules/react'),
            'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
        },
    },
    devtool: 'source-map',
    cache: true,
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react'],
                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: 'src/main/react',
                        },
                    },
                ],
            },
            {
                test: /\.(woff(2)?|ttf|eot)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'webfonts/[name][ext]',
                },
            },
        ],
    },
    plugins: [
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
    ],
};
