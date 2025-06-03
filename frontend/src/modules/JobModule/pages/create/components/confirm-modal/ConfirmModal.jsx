import { Modal, Button } from "antd";
import { useJob } from "../../../../contexts/jobContext";

export const JobConfirmModal = ({ onCreate }) => {
    const { confirmVisible, setConfirmVisible, jobData } = useJob();

    const handleOk = async () => {
        try {
            await onCreate(jobData);
        } catch (error) {
        } finally {
            setConfirmVisible(false);
        }
    };

    return (
        <Modal
            title="Confirmar creación de trabajo"
            open={confirmVisible}
            onCancel={() => setConfirmVisible(false)}
            footer={[
                <Button key="cancel" onClick={() => setConfirmVisible(false)}>
                    Cancelar
                </Button>,
                <Button key="create" type="primary" onClick={handleOk}>
                    Crear
                </Button>,
            ]}
        >
            {/* Aquí va el desglose del job */}
            <p>¿Estás seguro de que querés crear este trabajo?</p>
        </Modal>
    );
};
