import { Button, Col, Divider, Row, Space } from "antd"
import { Link } from "react-router-dom"
import { Mdeditor } from "../../components/editor"

export default function PostCreate() {
    return (
        <>
            <Row>
                <Col span={1}>
                    <Button type="primary">
                        Create
                    </Button>
                </Col>
                <Col offset={22} span={1}>
                    <Button style={{ float: "right" }} type="primary" danger>
                        <Link to="/posts">Cancel</Link>
                    </Button>
                </Col>
            </Row>
            <Divider />
            <Row>
                <Col span={24}>
                    <Mdeditor />
                </Col>
            </Row>
            {/* <Mdeditor /> */}
        </>
    )
}